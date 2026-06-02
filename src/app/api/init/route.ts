import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  await seedDatabase();
  return NextResponse.json({ ok: true });
}
