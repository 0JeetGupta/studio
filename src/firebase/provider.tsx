'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Auth, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { initializeFirebase } from './config';

interface FirebaseContextType {
  auth: Auth;
  firestore: Firestore;
  user: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { auth, firestore } = initializeFirebase();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <FirebaseContext.Provider value={{ auth, firestore, user, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirestore() {
  return useFirebase().firestore;
}

export function useAuth() {
  const { user, loading, auth } = useFirebase();
  return { user, loading, auth };
}