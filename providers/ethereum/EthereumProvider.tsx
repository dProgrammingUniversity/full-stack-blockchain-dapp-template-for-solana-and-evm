'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Web3 from 'web3';

// Define types for our context
interface EthereumContextType {
  web3: Web3 | null;
  account: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
}

// Create context
const EthereumContext = createContext<EthereumContextType>({
  web3: null,
  account: null,
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
  isConnected: false,
});

// Custom hook to use the Ethereum context
export const useEthereum = () => useContext(EthereumContext);

export function EthereumProvider({ children }: { children: ReactNode }) {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  // Initialize Web3
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId));
      });
    }
  }, []);

  // Connect wallet
  const connect = async () => {
    if (!web3) return;
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAccount(accounts[0]);

      // Get chain ID
      const chainId = await web3.eth.getChainId();
      const chainIdNumber = Number(chainId);
      setChainId(chainIdNumber);

      // Check if we're on Sepolia (chainId: 11155111)
      if (chainIdNumber !== 11155111) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
          });
        } catch (error: any) {
          console.error('Failed to switch to Sepolia:', error);
        }
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setAccount(null);
  };

  return (
    <EthereumContext.Provider value={{
      web3,
      account,
      chainId,
      connect,
      disconnect,
      isConnected: !!account,
    }}>
      {children}
    </EthereumContext.Provider>
  );
}