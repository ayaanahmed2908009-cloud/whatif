// Deterministic visuals per node, seeded from its id, so every node gets a
// stable backdrop without calling an image API.

const ACCENTS = [
  ["#FF7A45", "#FFB199"], // orange
  ["#14B8A6", "#5EEAD4"], // teal
  ["#A855F7", "#D8B4FE"], // purple
  ["#4648D4", "#9A9CFB"], // indigo
];

// Stand-in art borrowed from the landing page hero illustrations. Placeholder
// for a planned per-node Gemini-generated image keyed off node.text.
const PLACEHOLDER_IMAGES = [
  "/images/hero-caesar-london.png",
  "/images/mongol-eurasian-khaganate.png",
  "/images/duel-mode-soviet-invasion.png",
  "/images/king-trump-coronation.png",
  "/images/unified-korea.png",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function gradientForId(id: string): string {
  const hash = hashString(id);
  const [from, to] = ACCENTS[hash % ACCENTS.length];
  const angle = hash % 360;
  return `linear-gradient(${angle}deg, ${from}, ${to})`;
}

export function imageForId(id: string): string {
  const hash = hashString(id);
  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length];
}
