export type Probability = "likely" | "possible" | "speculative";
export type Lens = "social" | "economic" | "technological" | "human";
export type DivergenceLevel = "grounded" | "plausible" | "speculative" | "wild";

export interface CascadeNode {
  id: string;
  text: string;
  probability: Probability;
  lens: Lens;
  children: CascadeNode[];
}

export interface CascadeTree {
  premise: string;
  divergence_level: DivergenceLevel;
  branches: CascadeNode[];
}
