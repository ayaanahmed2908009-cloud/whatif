import { CascadeNode, CascadeTree } from "./types";

export function flattenNodes(tree: CascadeTree): CascadeNode[] {
  const result: CascadeNode[] = [];

  function visit(nodes: CascadeNode[]) {
    for (const node of nodes) {
      result.push(node);
      if (node.children.length > 0) visit(node.children);
    }
  }

  visit(tree.branches);
  return result;
}

/**
 * Branches + their direct children only (depths 0 and 1), excluding
 * grandchildren. Used to preload the tiers a user is most likely to reach
 * immediately, while the least-likely tier (grandchildren) loads lazily
 * on first visit via the per-node fallback path.
 */
export function flattenTopTwoLevels(tree: CascadeTree): CascadeNode[] {
  const result: CascadeNode[] = [];

  for (const branch of tree.branches) {
    result.push(branch);
    result.push(...branch.children);
  }

  return result;
}
