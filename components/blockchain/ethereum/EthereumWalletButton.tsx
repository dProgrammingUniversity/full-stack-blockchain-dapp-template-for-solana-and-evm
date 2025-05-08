'use client';

import { FC } from 'react';
import { useEthereum } from '@/providers/ethereum/EthereumProvider';
import { Button } from "@/components/ui/button";

export const EthereumWalletButton: FC = () => {
  const { connect, disconnect, isConnected, account } = useEthereum();

  return (
    <Button
      onClick={() => isConnected ? disconnect() : connect()}
      className={`${
        isConnected ? 'bg-green-500' : 'bg-blue-500'
      } text-white font-bold py-2 px-4 rounded hover:opacity-80 transition-opacity`}
    >
      {isConnected 
        ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}`
        : 'Connect Ethereum Wallet'
      }
    </Button>
  );
};