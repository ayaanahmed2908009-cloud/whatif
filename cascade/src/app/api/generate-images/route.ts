import { NextRequest, NextResponse } from "next/server";
import { generateImagesWithConcurrency } from "@/lib/geminiImage.server";

interface ImageRequestItem {
  id: string;
  text: string;
  lens: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const items: ImageRequestItem[] = Array.isArray(body.items) ? body.items : [];

  if (items.length === 0) {
    return NextResponse.json({ images: {} });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // No key configured: not an error, callers fall back to placeholder art.
    return NextResponse.json({ images: {} });
  }

  try {
    const images = await generateImagesWithConcurrency(items, apiKey, 10);
    return NextResponse.json({ images });
  } catch (err) {
    console.error("generate-images error:", err);
    return NextResponse.json({ images: {} });
  }
}
