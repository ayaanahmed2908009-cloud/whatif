import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "./firebase";
import { CascadeTree } from "./types";

export interface SavedCascade {
  id: string;
  tree: CascadeTree;
  createdAt: number;
}

export async function saveCascade(uid: string, tree: CascadeTree): Promise<string> {
  const docRef = await addDoc(collection(db, "cascades"), {
    uid,
    premise: tree.premise,
    tree,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserCascades(uid: string): Promise<SavedCascade[]> {
  const q = query(collection(db, "cascades"), where("uid", "==", uid));
  const snap = await getDocs(q);

  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        tree: data.tree as CascadeTree,
        createdAt: data.createdAt?.toMillis?.() ?? 0,
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getCascadeById(id: string): Promise<SavedCascade | null> {
  const snap = await getDoc(doc(db, "cascades", id));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    id: snap.id,
    tree: data.tree as CascadeTree,
    createdAt: data.createdAt?.toMillis?.() ?? 0,
  };
}
