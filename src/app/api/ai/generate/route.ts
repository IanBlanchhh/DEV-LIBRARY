import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// Generates beginner-friendly documentation content with the Anthropic API.
// Set ANTHROPIC_API_KEY in .env.local to enable. Without it, returns a clear,
// non-fatal message so the UI can guide the user.

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, category, existing } = await req.json();
  if (!topic) {
    return NextResponse.json({ error: "A topic or title is required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "AI generation is not configured. Add ANTHROPIC_API_KEY to your .env.local file and restart the dev server to enable this feature.",
        configured: false,
      },
      { status: 503 }
    );
  }

  const system = `You are a friendly technical writer creating documentation for absolute beginners ("explain it like I'm new to coding"). Write clear, well-structured Markdown with: a short intro, step-by-step sections with ## headings, fenced code blocks where useful, tables for command/shortcut references, and a short "common mistakes" or "tips" section at the end. Keep jargon defined inline. Do not include front-matter or a code fence around the whole document — output raw Markdown only.`;

  const userPrompt = existing
    ? `Improve and substantially expand the following documentation about "${topic}"${category ? ` (category: ${category})` : ""}. Keep what's accurate, add depth, examples, and beginner explanations.\n\n--- CURRENT CONTENT ---\n${existing}`
    : `Write a comprehensive, beginner-friendly documentation guide titled "${topic}"${category ? ` for the "${category}" category` : ""}. Make it thorough and genuinely useful for someone brand new.`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 4096,
        system,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json(
        { error: `Anthropic API error (${resp.status}): ${errText.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = await resp.json();
    const content = (data.content || [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n");

    return NextResponse.json({ content, configured: true });
  } catch (e) {
    return NextResponse.json(
      { error: `Request failed: ${e instanceof Error ? e.message : "unknown error"}` },
      { status: 500 }
    );
  }
}
