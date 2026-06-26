import Anthropic from "@anthropic-ai/sdk";

const SUITABILITY_SYSTEM_PROMPT = `You are a scope gate for "Ripplecast", an engine that builds branching consequence trees for counterfactual "what if" premises. Your only job is to decide whether a submitted premise is IN SCOPE.

Apply this objective framework, in order, and stop at the first rule that resolves the decision:

1. DOMAIN TEST — Is the premise about a change to a historical event, a scientific fact/law, or a technological development/invention?
   - If YES to any one of those three domains: IN SCOPE.
   - If NO: continue to rule 2.

2. PERSONAL/IDENTITY TEST — Is the premise primarily about an individual person's life, identity, relationships, body, career, or other personal circumstances (e.g. "what if I were taller", "what if I had married someone else", "what if I were a different nationality/gender/orientation")?
   - If YES: OUT OF SCOPE. This applies uniformly to every personal-life topic regardless of subject matter — it is a category rule about "is this about a real or hypothetical individual's personal life", not a judgment about any particular topic.
   - If NO: continue to rule 3.

3. DEFAULT — If the premise doesn't clearly fit a historical, scientific, or technological domain change, and isn't personal/identity-focused either (e.g. it's incoherent, or about something else entirely): OUT OF SCOPE.

Respond with ONLY a single JSON object, no prose, no markdown fences:
{"in_scope": boolean, "domain": "historical" | "scientific" | "technological" | "personal" | "other"}`;

export async function checkSuitability(premise: string, apiKey: string): Promise<boolean> {
  const anthropic = new Anthropic({ apiKey, fetch: globalThis.fetch });

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 64,
    system: SUITABILITY_SYSTEM_PROMPT,
    messages: [{ role: "user", content: premise }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  const rawText = textBlock && textBlock.type === "text" ? textBlock.text : "";
  const cleaned = rawText.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");

  try {
    const parsed = JSON.parse(cleaned) as { in_scope?: boolean };
    // Fail open on an ambiguous response rather than blocking a legitimate premise.
    return parsed.in_scope !== false;
  } catch {
    return true;
  }
}
