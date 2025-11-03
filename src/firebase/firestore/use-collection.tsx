'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, query, collection, where, type Query, type DocumentData, type CollectionReference } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

interface UseCollectionOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where?: [string, any, any];
}

export const useCollection = <T extends DocumentData>(
  collectionName: string,
  options?: UseCollectionOptions
) => {
  const db = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q: Query | CollectionReference = collection(db, collectionName);

    if (options?.where) {
      q = query(q, where(...options.where));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(docs);
        setLoading(false);
      },
      (error) => {
        console.error(`Error fetching collection ${collectionName}:`, error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, db, options]);

  return { data, loading };
};
