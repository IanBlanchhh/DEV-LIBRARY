import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { docs: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await req.json();
  const slug = data.slug || slugify(data.name);

  const category = await prisma.category.create({
    data: { ...data, slug },
  });
  return NextResponse.json(category, { status: 201 });
}
