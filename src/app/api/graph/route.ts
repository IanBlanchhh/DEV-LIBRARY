import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await prisma.category.findMany({
    include: { docs: true },
  });
  const projects = await prisma.project.findMany({
    where: user.role === "admin" ? {} : { userId: user.id },
  });

  const nodes: unknown[] = [];
  const edges: unknown[] = [];

  // Root node
  nodes.push({ id: "root", data: { label: "DevLibrary", type: "root" }, position: { x: 0, y: 0 } });

  // Category nodes
  categories.forEach((cat, i) => {
    const angle = (i / categories.length) * 2 * Math.PI;
    const r = 250;
    nodes.push({
      id: `cat-${cat.id}`,
      data: { label: cat.name, type: "category", color: cat.color, icon: cat.icon, slug: cat.slug, catId: cat.id },
      position: { x: Math.cos(angle) * r, y: Math.sin(angle) * r },
    });
    edges.push({ id: `e-root-cat-${cat.id}`, source: "root", target: `cat-${cat.id}` });

    // Doc nodes
    cat.docs.forEach((doc, j) => {
      const docAngle = angle + (j - cat.docs.length / 2) * 0.3;
      const dr = 150;
      nodes.push({
        id: `doc-${doc.id}`,
        data: { label: doc.title, type: "doc", categoryColor: cat.color, docId: doc.id, categorySlug: cat.slug },
        position: {
          x: Math.cos(angle) * r + Math.cos(docAngle) * dr,
          y: Math.sin(angle) * r + Math.sin(docAngle) * dr,
        },
      });
      edges.push({ id: `e-cat-doc-${doc.id}`, source: `cat-${cat.id}`, target: `doc-${doc.id}` });
    });
  });

  // Project nodes
  projects.forEach((proj, i) => {
    const angle = (i / Math.max(projects.length, 1)) * 2 * Math.PI;
    nodes.push({
      id: `proj-${proj.id}`,
      data: { label: proj.name, type: "project" },
      position: { x: Math.cos(angle) * 450, y: Math.sin(angle) * 450 },
    });
    edges.push({ id: `e-root-proj-${proj.id}`, source: "root", target: `proj-${proj.id}` });
  });

  return NextResponse.json({ nodes, edges });
}
