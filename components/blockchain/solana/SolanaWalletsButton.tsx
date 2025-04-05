'use client';

import { FC } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export const SolanaWalletsButton: FC = () => {
  const { connected } = useWallet();

  return (
    <div className="wallet-button-container">
      <WalletMultiButton className={`wallet-adapter-button ${
        connected ? 'bg-green-500' : 'bg-blue-500'
      } text-white font-bold py-2 px-4 rounded hover:opacity-80 transition-opacity`} />
      <style jsx global>{`
        .wallet-adapter-button-trigger {
          background-color: theme(colors.green.500) !important;
        }
        .wallet-adapter-dropdown {
          font-family: inherit;
        }
        .wallet-adapter-button {
          height: 36px !important;
          padding: 0 16px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          border-radius: 6px !important;
        }
      `}</style>
    </div>
  );
};