export const CASCADE_ERROR_CODES = {
  EMPTY_PREMISE: "WHATIF_001",
  INVALID_PREMISE: "WHATIF_002",
  UNSAFE_CONTENT: "WHATIF_003",
  OFF_TOPIC: "WHATIF_004",
  TOO_BIZARRE: "WHATIF_005",
  GENERATION_FAILED: "WHATIF_006",
  MODEL_OUTPUT_INVALID: "WHATIF_007",
  OUT_OF_SCOPE: "WHATIF_008",
  CONFIG_ERROR: "WHATIF_500",
} as const;

export type CascadeErrorCode = (typeof CASCADE_ERROR_CODES)[keyof typeof CASCADE_ERROR_CODES];

export const CASCADE_ERROR_MESSAGES: Record<CascadeErrorCode, string> = {
  [CASCADE_ERROR_CODES.EMPTY_PREMISE]: "Type a \"what if\" to get started.",
  [CASCADE_ERROR_CODES.INVALID_PREMISE]:
    "That doesn't read as a \"what if\" scenario. Try framing it as a clear hypothetical.",
  [CASCADE_ERROR_CODES.UNSAFE_CONTENT]:
    "That premise isn't something we can explore here. Try a different historical, scientific, or speculative \"what if.\"",
  [CASCADE_ERROR_CODES.OFF_TOPIC]:
    "Divergence is built for historical, scientific, and speculative \"what if\" scenarios — try one of those.",
  [CASCADE_ERROR_CODES.TOO_BIZARRE]:
    "That's a bit too out-there for us to build a coherent cascade from. Try grounding it in a real premise.",
  [CASCADE_ERROR_CODES.OUT_OF_SCOPE]:
    "Divergence focuses on historical, scientific, and technological \"what if\" scenarios. Personal or identity-based premises aren't supported — try a historical or scientific one instead.",
  [CASCADE_ERROR_CODES.GENERATION_FAILED]: "Something went wrong generating that cascade. Please try again.",
  [CASCADE_ERROR_CODES.MODEL_OUTPUT_INVALID]: "Something went wrong generating that cascade. Please try again.",
  [CASCADE_ERROR_CODES.CONFIG_ERROR]: "The engine isn't configured correctly. Please try again later.",
};
