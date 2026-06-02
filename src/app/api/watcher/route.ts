import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import path from "path";
import fs from "fs";

function buildStructure(dirPath: string, depth = 0): unknown {
  if (depth > 4) return null;
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    return items
      .filter((i) => !i.name.startsWith("."))
      .map((item) => ({
        name: item.name,
        type: item.isDirectory() ? "dir" : "file",
        children: item.isDirectory()
          ? buildStructure(path.join(dirPath, item.name), depth + 1)
          : null,
      }));
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, folderPath, name, description } = await req.json();

  if (action === "sync") {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    const watchDir = settings?.watchedDirectory;

    if (!watchDir || !fs.existsSync(watchDir)) {
      return NextResponse.json({ error: "Watch directory not configured or not found" }, { status: 400 });
    }

    const entries = fs.readdirSync(watchDir, { withFileTypes: true });
    const folders = entries.filter((e) => e.isDirectory() && !e.name.startsWith("."));

    for (const folder of folders) {
      const fullPath = path.join(watchDir, folder.name);
      const structure = buildStructure(fullPath);
      await prisma.project.upsert({
        where: { path: fullPath },
        update: { structure: JSON.stringify(structure), updatedAt: new Date() },
        create: {
          name: folder.name,
          path: fullPath,
          structure: JSON.stringify(structure),
          userId: user.id,
        },
      });
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ synced: folders.length, projects });
  }

  if (action === "add" && folderPath) {
    const structure = buildStructure(folderPath);
    const project = await prisma.project.upsert({
      where: { path: folderPath },
      update: { structure: JSON.stringify(structure), description, updatedAt: new Date() },
      create: {
        name: name || path.basename(folderPath),
        path: folderPath,
        description,
        structure: JSON.stringify(structure),
        userId: user.id,
      },
    });
    return NextResponse.json(project);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
