'use client';

import { FC, useState, useCallback } from 'react';
import { useEthereum } from '@/providers/ethereum/EthereumProvider';
import { EthereumWalletButton } from './EthereumWalletButton';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Your contract details
const CONTRACT_ADDRESS = '0x6fa7cb429f8430665f9315810b07e031f0ffe30f';
const CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "getMessage",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "message",
                "type": "string"
            }
        ],
        "name": "MessageInitialized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "message",
                "type": "string"
            }
        ],
        "name": "MessageRetrieved",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "isInitialized",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]; // Paste the ABI you provided

export const HelloWeb3WorldEth: FC = () => {
    const { web3, isConnected, account } = useEthereum();
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const fetchMessage = useCallback(async () => {
        if (!web3 || !isConnected) {
            setError('Please connect your wallet first!');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

            // Check if initialized
            const initialized = await contract.methods.isInitialized().call();

            if (!initialized) {
                // Initialize if not already initialized
                if (!account) throw new Error("No account connected");
                await contract.methods.initialize().send({ from: account });
            }

            // Get message
            const result = await contract.methods.getMessage().call();
            if (typeof result === 'string') {
                setMessage(result);
            } else {
                throw new Error("Invalid message format received");
            }
        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message || 'Failed to fetch message');
        } finally {
            setLoading(false);
        }
    }, [web3, isConnected, account]);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Ethereum Contract Interaction</CardTitle>
                <CardDescription>
                    Interact with our deployed Ethereum contract on Sepolia to fetch an on-chain message
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-center">
                    <EthereumWalletButton />
                </div>

                <Button
                    onClick={fetchMessage}
                    disabled={!isConnected || loading || !!message}
                    className="w-full"
                >
                    {loading ? 'Loading...' : message ? 'Message Fetched' : 'Fetch Message'}
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
                {isConnected ? 'Wallet connected' : 'Please connect your wallet to interact'}
            </CardFooter>
        </Card>
    );
};