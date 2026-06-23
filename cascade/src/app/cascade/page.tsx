"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import NodeCard from "@/components/NodeCard";
import Breadcrumb, { BreadcrumbEntry } from "@/components/Breadcrumb";
import ZoomOutMap from "@/components/ZoomOutMap";
import { CascadeNode, CascadeTree, DivergenceLevel } from "@/lib/types";

const LEVELS: DivergenceLevel[] = ["grounded", "plausible", "speculative", "wild"];

type Stage = "input" | "loading" | "experience";

function truncate(text: string, max = 48): string {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

export default function CascadePage() {
  return (
    <Suspense fallback={null}>
      <CascadePageInner />
    </Suspense>
  );
}

function CascadePageInner() {
  const searchParams = useSearchParams();
  const [stage, setStage] = useState<Stage>("input");
  const [premise, setPremise] = useState("");
  const [level, setLevel] = useState<DivergenceLevel>("plausible");
  const [tree, setTree] = useState<CascadeTree | null>(null);
  const [path, setPath] = useState<CascadeNode[]>([]);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [showMap, setShowMap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autostarted = useRef(false);

  async function generate(premiseToUse: string, levelToUse: DivergenceLevel) {
    if (!premiseToUse.trim() || stage === "loading") return;

    setStage("loading");
    setError(null);

    try {
      const res = await fetch("/api/cascade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ premise: premiseToUse, divergenceLevel: levelToUse }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setTree(data as CascadeTree);
      setRevealedIds(new Set());
      setPath([]);
      setStage("experience");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStage("input");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    generate(premise, level);
  }

  // Entry from the landing page hero search bar / trending chips: ?premise=...&autostart=1
  useEffect(() => {
    if (autostarted.current) return;
    const premiseParam = searchParams.get("premise");
    if (!premiseParam) return;

    autostarted.current = true;
    setPremise(premiseParam);

    if (searchParams.get("autostart") === "1") {
      generate(premiseParam, level);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const currentLevelNodes = useMemo(() => {
    if (!tree) return [];
    return path.length === 0 ? tree.branches : path[path.length - 1].children;
  }, [tree, path]);

  function enterNode(node: CascadeNode) {
    if (node.children.length === 0) return;
    setPath((p) => [...p, node]);
  }

  function handleCardClick(node: CascadeNode) {
    if (!revealedIds.has(node.id)) {
      setRevealedIds((prev) => new Set(prev).add(node.id));
      return;
    }
    enterNode(node);
  }

  function goBack() {
    setPath((p) => p.slice(0, -1));
  }

  function jumpTo(index: number) {
    setPath((p) => p.slice(0, index));
  }

  function jumpToNodeId(id: string) {
    if (!tree) return;
    if (id === tree.premise) {
      setPath([]);
      setShowMap(false);
      return;
    }
    for (const branch of tree.branches) {
      if (branch.id === id) {
        setPath([branch]);
        setShowMap(false);
        return;
      }
      for (const child of branch.children) {
        if (child.id === id) {
          setPath([branch, child]);
          setShowMap(false);
          return;
        }
      }
    }
  }

  if (stage === "loading") {
    return <LoadingScreen premise={premise} />;
  }

  if (stage === "experience" && tree) {
    const breadcrumbEntries: BreadcrumbEntry[] = [
      { label: truncate(tree.premise, 32), node: null },
      ...path.map((n) => ({ label: truncate(n.text, 32), node: n })),
    ];

    return (
      <main className="flex min-h-screen flex-col items-center gap-8 px-6 py-12">
        <div className="flex w-full max-w-container items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={path.length === 0}
            className="flex items-center gap-1 text-[14px] font-semibold text-on-surface disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="rounded-full border-[0.5px] border-outline-variant px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
          >
            Zoom out
          </button>
        </div>

        <Breadcrumb entries={breadcrumbEntries} onJump={jumpTo} />

        <div className="grid w-full max-w-container grid-cols-1 gap-5 md:grid-cols-3">
          {currentLevelNodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              revealed={revealedIds.has(node.id)}
              onClick={() => handleCardClick(node)}
            />
          ))}
        </div>

        {showMap && (
          <ZoomOutMap
            tree={tree}
            visitedIds={revealedIds}
            onSelect={jumpToNodeId}
            onClose={() => setShowMap(false)}
          />
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-container flex-col items-center justify-center gap-10 px-6 text-center">
      <h1 className="max-w-[800px] text-[36px] font-bold leading-[42px] tracking-[-0.02em] text-on-surface md:text-[48px] md:leading-[56px]">
        What if...
      </h1>

      <form onSubmit={handleSubmit} className="flex w-full max-w-[600px] flex-col gap-4">
        <input
          value={premise}
          onChange={(e) => setPremise(e.target.value)}
          placeholder="the printing press was never invented"
          className="rounded-lg border-[0.5px] border-outline-variant bg-surface-container-lowest px-4 py-3 text-[16px] text-on-surface outline-none focus:border-secondary"
        />
        <div className="flex justify-center gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={`rounded-full px-4 py-1 text-[12px] font-bold uppercase tracking-[0.1em] ${
                level === l
                  ? "bg-primary text-on-primary"
                  : "border-[0.5px] border-outline-variant text-on-surface-variant"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary px-8 py-3 font-semibold text-on-primary transition-colors hover:bg-secondary"
        >
          Cascade
        </button>
      </form>

      {error && <p className="text-error">{error}</p>}
    </main>
  );
}
