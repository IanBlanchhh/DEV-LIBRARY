import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const categoryId = searchParams.get("categoryId");

  const where: Record<string, unknown> = {};
  if (categoryId) where.categoryId = categoryId;
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { content: { contains: q } },
    ];
  }

  const docs = await prisma.doc.findMany({
    where,
    include: { category: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const slug = data.slug || slugify(data.title);

  const doc = await prisma.doc.create({
    data: { ...data, slug },
    include: { category: true },
  });
  return NextResponse.json(doc, { status: 201 });
}
