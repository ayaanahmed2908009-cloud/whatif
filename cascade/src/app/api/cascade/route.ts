import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt";
import { DivergenceLevel } from "@/lib/types";

const VALID_LEVELS: DivergenceLevel[] = [
  "grounded",
  "plausible",
  "speculative",
  "wild",
];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const premise: string = body.premise;
  const divergenceLevel: DivergenceLevel = VALID_LEVELS.includes(
    body.divergenceLevel
  )
    ? body.divergenceLevel
    : "plausible";

  if (!premise || typeof premise !== "string" || premise.trim().length === 0) {
    return NextResponse.json(
      { error: "premise is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set on the server" },
      { status: 500 }
    );
  }

  const anthropic = new Anthropic({ apiKey, fetch: globalThis.fetch });

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: buildSystemPrompt(divergenceLevel),
      messages: [{ role: "user", content: buildUserPrompt(premise) }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const rawText = textBlock && textBlock.type === "text" ? textBlock.text : "";
    // Models occasionally wrap JSON in a markdown fence despite instructions not to.
    const cleanedText = rawText
      .trim()
      .replace(/^```(?:json)?\s*/, "")
      .replace(/\s*```$/, "");

    let tree;
    try {
      tree = JSON.parse(cleanedText);
    } catch {
      return NextResponse.json(
        { error: "Model did not return valid JSON", raw: rawText },
        { status: 502 }
      );
    }

    return NextResponse.json(tree);
  } catch (err) {
    console.error("Cascade API error:", err);
    return NextResponse.json(
      { error: "Failed to generate cascade" },
      { status: 500 }
    );
  }
}
