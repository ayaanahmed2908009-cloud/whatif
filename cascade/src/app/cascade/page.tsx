"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthScreen from "@/components/AuthScreen";
import LoadingScreen, { LoadingPhase } from "@/components/LoadingScreen";
import StoryView from "@/components/StoryView";
import ZoomOutMap from "@/components/ZoomOutMap";
import { CascadeNode, CascadeTree, DivergenceLevel } from "@/lib/types";
import { flattenTopTwoLevels } from "@/lib/treeUtils";
import { clearNodeImageCache, seedNodeImageCache } from "@/lib/nodeImage";
import { auth } from "@/lib/firebase";
import { getCascadeById, saveCascade } from "@/lib/cascades";

// How long the cinematic loading beat plays before the auth gate appears.
// Generation keeps running underneath it the whole time.
const AUTH_GATE_DELAY_MS = 4500;

type Stage = "input" | "loading" | "auth" | "experience";

function resolvePath(tree: CascadeTree, indices: number[]) {
  const chain: CascadeNode[] = [];
  let siblings: CascadeNode[] = tree.branches;

  for (let depth = 0; depth < indices.length; depth++) {
    const node = siblings[indices[depth]];
    chain.push(node);
    if (depth < indices.length - 1) {
      siblings = node.children;
    }
  }

  const lastSiblings = indices.length === 1 ? tree.branches : chain[chain.length - 2].children;

  return {
    chain,
    node: chain[chain.length - 1],
    siblings: lastSiblings,
    index: indices[indices.length - 1],
    depth: indices.length - 1,
  };
}

export default function CascadePage() {
  return (
    <Suspense fallback={null}>
      <CascadePageInner />
    </Suspense>
  );
}

function CascadePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stage, setStage] = useState<Stage>("input");
  const [premise, setPremise] = useState("");
  const [level, setLevel] = useState<DivergenceLevel>("plausible");
  const [tree, setTree] = useState<CascadeTree | null>(null);
  const [indices, setIndices] = useState<number[]>([0]);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());
  const [showMap, setShowMap] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>("tree");
  const autostarted = useRef(false);

  function redirectHomeWithError(code?: string) {
    router.replace(code ? `/?error=${code}` : "/");
  }

  // Generation runs in the background while the auth gate is showing, so we
  // track readiness/progress outside of React state to avoid racing the UI.
  const treeReadyRef = useRef(false);
  const pastAuthRef = useRef(false);
  // A freshly generated tree gets saved to the signed-in user's library once;
  // a tree opened from that library (?load=) is already saved.
  const shouldSaveRef = useRef(false);
  const savedRef = useRef(false);

  function handleAuthContinue() {
    if (treeReadyRef.current) {
      setStage("experience");
    } else {
      pastAuthRef.current = true;
      setStage("loading");
    }
  }

  async function loadSaved(id: string) {
    setStage("loading");
    setLoadingPhase("tree");
    clearNodeImageCache();
    shouldSaveRef.current = false;

    try {
      const saved = await getCascadeById(id);
      if (!saved) {
        router.replace("/");
        return;
      }

      setPremise(saved.tree.premise);
      setLevel(saved.tree.divergence_level);
      setLoadingPhase("images");
      try {
        const items = flattenTopTwoLevels(saved.tree).map((n) => ({ id: n.id, text: n.text, lens: n.lens }));
        const imgRes = await fetch("/api/generate-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          seedNodeImageCache(imgData.images ?? {});
        }
      } catch {
        // Non-fatal: experience still works with placeholder art.
      }

      setTree(saved.tree);
      setIndices([0]);
      setVisitedIds(new Set());
      setStage("experience");
    } catch {
      router.replace("/");
    }
  }

  async function generate(premiseToUse: string, levelToUse: DivergenceLevel) {
    if (!premiseToUse.trim() || stage === "loading") return;

    setStage("loading");
    setLoadingPhase("tree");
    clearNodeImageCache();
    treeReadyRef.current = false;
    pastAuthRef.current = false;
    shouldSaveRef.current = true;
    savedRef.current = false;

    const authGateTimer = setTimeout(() => setStage("auth"), AUTH_GATE_DELAY_MS);

    try {
      const res = await fetch("/api/cascade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ premise: premiseToUse, divergenceLevel: levelToUse }),
      });

      const data = await res.json();
      if (!res.ok) {
        clearTimeout(authGateTimer);
        redirectHomeWithError(data.code);
        return;
      }

      const newTree = data as CascadeTree;

      // Preload every node's image before letting the user in, so navigation
      // never shows a pop-in from placeholder to real art. Best-effort: any
      // failure here just leaves those nodes on the placeholder gradient.
      setLoadingPhase("images");
      try {
        const items = flattenTopTwoLevels(newTree).map((n) => ({ id: n.id, text: n.text, lens: n.lens }));
        const imgRes = await fetch("/api/generate-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          seedNodeImageCache(imgData.images ?? {});
        }
      } catch {
        // Non-fatal: experience still works with placeholder art.
      }

      setTree(newTree);
      setIndices([0]);
      setVisitedIds(new Set());
      treeReadyRef.current = true;

      // If the user already clicked through the auth gate while this was
      // still running, let them straight into the experience now.
      if (pastAuthRef.current) {
        setStage("experience");
      }
    } catch {
      // No retry UI here anymore since the prompt screen is gone; send the
      // user back to the landing page to try again.
      clearTimeout(authGateTimer);
      redirectHomeWithError();
    }
  }

  // Entry points: the landing page hero search bar / trending chips
  // (?premise=...&autostart=1), or opening a saved cascade from the library
  // (?load=<id>). Anyone landing here with neither gets sent back home
  // instead of seeing a second "enter your prompt" screen.
  useEffect(() => {
    if (autostarted.current) return;

    const loadId = searchParams.get("load");
    if (loadId) {
      autostarted.current = true;
      loadSaved(loadId);
      return;
    }

    const premiseParam = searchParams.get("premise");
    if (!premiseParam) {
      router.replace("/");
      return;
    }

    autostarted.current = true;
    setPremise(premiseParam);

    if (searchParams.get("autostart") === "1") {
      generate(premiseParam, level);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Save a freshly generated cascade to the signed-in user's library exactly
  // once, after they've actually made it into the experience.
  useEffect(() => {
    if (stage !== "experience" || !tree || !shouldSaveRef.current || savedRef.current) return;
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    savedRef.current = true;
    saveCascade(uid, tree).catch(() => {
      // Best-effort: failing to save shouldn't interrupt the experience.
      savedRef.current = false;
    });
  }, [stage, tree]);

  const resolved = useMemo(() => {
    if (!tree) return null;
    return resolvePath(tree, indices);
  }, [tree, indices]);

  useEffect(() => {
    if (!resolved) return;
    setVisitedIds((prev) => {
      if (prev.has(resolved.node.id)) return prev;
      return new Set(prev).add(resolved.node.id);
    });
  }, [resolved]);

  function goToSibling(newIndex: number) {
    setIndices((prev) => {
      if (newIndex < 0) return prev;
      const next = [...prev];
      next[next.length - 1] = newIndex;
      return next;
    });
  }

  function descend() {
    if (!resolved || resolved.node.children.length === 0) return;
    setIndices((prev) => [...prev, 0]);
  }

  function goBack() {
    setIndices((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }

  function exitToStart() {
    router.push("/");
  }

  function jumpToNodeId(id: string) {
    if (!tree) return;

    for (let bi = 0; bi < tree.branches.length; bi++) {
      const branch = tree.branches[bi];
      if (branch.id === id) {
        setIndices([bi]);
        setShowMap(false);
        return;
      }
      for (let ci = 0; ci < branch.children.length; ci++) {
        const child = branch.children[ci];
        if (child.id === id) {
          setIndices([bi, ci]);
          setShowMap(false);
          return;
        }
        for (let gi = 0; gi < child.children.length; gi++) {
          const grandchild = child.children[gi];
          if (grandchild.id === id) {
            setIndices([bi, ci, gi]);
            setShowMap(false);
            return;
          }
        }
      }
    }
  }

  // Keyboard navigation: arrows move between siblings, Enter descends, Escape backs out / closes the map.
  useEffect(() => {
    if (stage !== "experience" || !resolved) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (showMap) {
        if (e.key === "Escape") {
          e.preventDefault();
          setShowMap(false);
        }
        return;
      }
      if (!resolved) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (resolved.index > 0) goToSibling(resolved.index - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (resolved.index < resolved.siblings.length - 1) goToSibling(resolved.index + 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        descend();
      } else if (e.key === "Escape") {
        e.preventDefault();
        goBack();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, resolved, showMap]);

  if (stage === "loading") {
    return <LoadingScreen premise={premise} level={level} phase={loadingPhase} />;
  }

  if (stage === "auth") {
    return <AuthScreen onContinue={handleAuthContinue} />;
  }

  if (stage === "experience" && tree && resolved) {
    return (
      <>
        <StoryView
          node={resolved.node}
          siblings={resolved.siblings}
          index={resolved.index}
          depth={resolved.depth}
          premise={tree.premise}
          level={level}
          visitedIds={visitedIds}
          canGoBack={indices.length > 1}
          onPrev={() => goToSibling(resolved.index - 1)}
          onNext={() => goToSibling(resolved.index + 1)}
          onDescend={descend}
          onBack={goBack}
          onShowMap={() => setShowMap(true)}
          onExit={exitToStart}
        />

        {showMap && (
          <ZoomOutMap
            tree={tree}
            visitedIds={visitedIds}
            currentNodeId={resolved.node.id}
            onSelect={jumpToNodeId}
            onClose={() => setShowMap(false)}
          />
        )}
      </>
    );
  }

  // No premise yet: either redirecting home, or the autostart effect is about
  // to fire. There is no standalone "enter your prompt" screen here anymore —
  // the landing page hero search bar is the only entry point.
  return null;
}
