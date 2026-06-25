import { CascadeNode } from "./types";

// In-memory, module-level so it survives StoryView remounts within the
// session (e.g. revisiting a node) without needing to thread cache state
// through page.tsx.
const cache = new Map<string, string>();
const inFlight = new Map<string, Promise<string | null>>();

export function getCachedNodeImage(nodeId: string): string | undefined {
  return cache.get(nodeId);
}

/** Populates the cache from a preloaded batch (see lib/treeUtils.flattenNodes). */
export function seedNodeImageCache(images: Record<string, string>): void {
  for (const [id, src] of Object.entries(images)) {
    cache.set(id, src);
  }
}

export function clearNodeImageCache(): void {
  cache.clear();
}

export async function requestNodeImage(node: CascadeNode): Promise<string | null> {
  const cached = cache.get(node.id);
  if (cached) return cached;

  const pending = inFlight.get(node.id);
  if (pending) return pending;

  const promise = fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: node.text, lens: node.lens }),
  })
    .then(async (res) => {
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.image) return null;
      cache.set(node.id, data.image);
      return data.image as string;
    })
    .catch(() => null)
    .finally(() => {
      inFlight.delete(node.id);
    });

  inFlight.set(node.id, promise);
  return promise;
}
