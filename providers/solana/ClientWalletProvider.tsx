'use client';

import dynamic from 'next/dynamic';

// Dynamically import the WalletContextProvider with no SSR
export const ClientWalletProvider = dynamic(
  () => import('./WalletProvider').then(({ WalletContextProvider }) => WalletContextProvider),
  { ssr: false }
);