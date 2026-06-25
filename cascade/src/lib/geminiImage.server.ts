import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const GEMINI_MODEL = "gemini-2.5-flash-image";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const CACHE_DIR = path.join(process.cwd(), ".image-cache");

function buildImagePrompt(text: string, lens: string): string {
  return `Create a single evocative, cinematic illustration representing this alternate-history consequence, viewed through a ${lens} lens: "${text}". Painterly, atmospheric, moody lighting, no text or letters anywhere in the image, no captions, no watermarks.`;
}

function cacheKeyFor(text: string, lens: string): string {
  return createHash("sha256").update(`${lens}::${text}`).digest("hex");
}

async function readFromDiskCache(key: string): Promise<string | null> {
  try {
    const buf = await readFile(path.join(CACHE_DIR, `${key}.png`));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

async function writeToDiskCache(key: string, dataUrl: string): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    const base64 = dataUrl.split(",")[1] ?? "";
    await writeFile(path.join(CACHE_DIR, `${key}.png`), Buffer.from(base64, "base64"));
  } catch (err) {
    console.error("Failed to write image cache:", err);
  }
}

async function callGemini(text: string, lens: string, apiKey: string): Promise<string | null> {
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildImagePrompt(text, lens) }] }],
    }),
  });

  if (!res.ok) {
    console.error("Gemini image API error:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find(
    (p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData
  );

  if (!imagePart?.inlineData) return null;

  const { mimeType, data: base64 } = imagePart.inlineData;
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Generates (or reuses a cached) image for a node's text+lens. Disk cache is
 * keyed by content hash, so identical text reused across sessions/restarts
 * never re-spends a Gemini call.
 */
export async function getOrGenerateNodeImage(
  text: string,
  lens: string,
  apiKey: string
): Promise<string | null> {
  const key = cacheKeyFor(text, lens);

  const cached = await readFromDiskCache(key);
  if (cached) return cached;

  const generated = await callGemini(text, lens, apiKey);
  if (generated) await writeToDiskCache(key, generated);
  return generated;
}

/**
 * Runs generation across many items with a concurrency cap, so a full tree
 * (~20 nodes) completes in a handful of overlapping requests rather than
 * either 20 sequential round-trips or 20 simultaneous ones risking rate limits.
 */
export async function generateImagesWithConcurrency<T extends { id: string; text: string; lens: string }>(
  items: T[],
  apiKey: string,
  concurrency = 5
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const item = items[cursor++];
      const image = await getOrGenerateNodeImage(item.text, item.lens, apiKey);
      if (image) results[item.id] = image;
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}
