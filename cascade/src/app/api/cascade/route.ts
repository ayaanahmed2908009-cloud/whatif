import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt";
import { DivergenceLevel } from "@/lib/types";
import { CASCADE_ERROR_CODES, CASCADE_ERROR_MESSAGES } from "@/lib/errors";
import { moderatePremise } from "@/lib/moderation.server";
import { checkSuitability } from "@/lib/suitability.server";

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
      { error: CASCADE_ERROR_MESSAGES[CASCADE_ERROR_CODES.EMPTY_PREMISE], code: CASCADE_ERROR_CODES.EMPTY_PREMISE },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: CASCADE_ERROR_MESSAGES[CASCADE_ERROR_CODES.CONFIG_ERROR], code: CASCADE_ERROR_CODES.CONFIG_ERROR },
      { status: 500 }
    );
  }

  // Safeguarding: keep this engine limited to genuine, on-topic, safe "what if"
  // premises before spending a full generation call on it.
  try {
    const moderation = await moderatePremise(premise, apiKey);
    if (!moderation.allowed) {
      const code = moderation.code ?? CASCADE_ERROR_CODES.INVALID_PREMISE;
      return NextResponse.json(
        { error: CASCADE_ERROR_MESSAGES[code], code },
        { status: 422 }
      );
    }
  } catch (err) {
    console.error("Moderation check failed:", err);
    // Fail open: a broken moderation call shouldn't block legitimate users.
  }

  // Scope check: a separate call applying an explicit, objective framework to
  // decide whether the premise is a historical/scientific/technological
  // counterfactual (in scope) versus a personal/identity premise or anything
  // else (out of scope). Kept distinct from the safety/coherence check above.
  try {
    const inScope = await checkSuitability(premise, apiKey);
    if (!inScope) {
      return NextResponse.json(
        {
          error: CASCADE_ERROR_MESSAGES[CASCADE_ERROR_CODES.OUT_OF_SCOPE],
          code: CASCADE_ERROR_CODES.OUT_OF_SCOPE,
        },
        { status: 422 }
      );
    }
  } catch (err) {
    console.error("Suitability check failed:", err);
    // Fail open: a broken scope check shouldn't block legitimate users.
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
        {
          error: CASCADE_ERROR_MESSAGES[CASCADE_ERROR_CODES.MODEL_OUTPUT_INVALID],
          code: CASCADE_ERROR_CODES.MODEL_OUTPUT_INVALID,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(tree);
  } catch (err) {
    console.error("Cascade API error:", err);
    return NextResponse.json(
      {
        error: CASCADE_ERROR_MESSAGES[CASCADE_ERROR_CODES.GENERATION_FAILED],
        code: CASCADE_ERROR_CODES.GENERATION_FAILED,
      },
      { status: 500 }
    );
  }
}
