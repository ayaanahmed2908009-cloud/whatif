import { NextRequest, NextResponse } from "next/server";
import { getOrGenerateNodeImage } from "@/lib/geminiImage.server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const text: string = body.text;
  const lens: string = body.lens ?? "general";

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set on the server" },
      { status: 501 }
    );
  }

  try {
    const image = await getOrGenerateNodeImage(text, lens, apiKey);
    if (!image) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 502 });
    }
    return NextResponse.json({ image });
  } catch (err) {
    console.error("generate-image error:", err);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
