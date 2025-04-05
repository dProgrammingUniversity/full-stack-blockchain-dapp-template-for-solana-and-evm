'use client';

import { FC, useState } from 'react';
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SolanaWalletsButton } from './SolanaWalletsButton';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HelloWeb3World as HelloWeb3WorldType } from '@/blockchain/solana/hello_web3_world/target/types/hello_web3_world';
import idl from '@/blockchain/solana/hello_web3_world/target/idl/hello_web3_world.json';

export const HelloWeb3World: FC = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Program ID from your deployed program
  const programId = new anchor.web3.PublicKey("G7Cu7VB7Dm79to3GKi3SLHGi2WWiJTLf9fL7uxafx8HS");

  // Message account (this should be the same one you used in tests)
  const messageAccount = new anchor.web3.PublicKey("2QsK7cWZPvx3GbW7uuHPcpYcqV2Emt5MqtgDYQTyCRiX");

  const getProvider = () => {
    if (!publicKey) throw new Error("Wallet not connected!");
    
    const provider = new anchor.AnchorProvider(
      connection,
      window.solana,
      { commitment: 'confirmed' }
    );
    return provider;
  };

  const fetchMessage = async () => {
    if (!connected) {
      setError('Please connect your wallet first!');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const provider = getProvider();
      const program = new Program(
        idl as anchor.Idl,
        provider
      ) as Program<HelloWeb3WorldType>;

      const account = await program.account.messageAccount.fetch(messageAccount);
      setMessage(account.content);
    } catch (err) {
      console.error('Error fetching message:', err);
      setError('Failed to fetch message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Solana Program Interaction</CardTitle>
        <CardDescription>
          Interact with my custom deployed Solana program on Devnet to fetch an on-chain message
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <SolanaWalletsButton />
        </div>
        
        <Button
          onClick={fetchMessage}
          disabled={loading || !connected || !!message}
          className="w-full"
        >
          {loading ? 'Fetching...' : message ? 'Message Fetched' : 'Fetch Message'}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-center font-medium">{message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {connected ? 'Wallet connected' : 'Please connect your wallet to interact'}
      </CardFooter>
    </Card>
  );
};