'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, doc, type DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

export const useDoc = <T extends DocumentData>(path: string) => {
  const db = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }
    const docRef = doc(db, path);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const docData = { id: snapshot.id, ...snapshot.data() } as T;
          setData(docData);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error(`Error fetching document ${path}:`, error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path, db]);

  return { data, loading };
};
