'use client';

import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

let app: ReturnType<typeof initializeFirebase>;

export const FirebaseClientProvider = ({ children }: { children: React.ReactNode }) => {
  if (!app) {
    app = initializeFirebase();
  }
  return <FirebaseProvider {...app}>{children}</FirebaseProvider>;
};
