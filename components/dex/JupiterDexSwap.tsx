'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SolanaWalletsButton } from '@/components/blockchain/solana/SolanaWalletsButton';
import { TokenSelect } from '@/components/dex/TokenSelect';
import { RecentTransactions } from '@/components/dex/RecentTransactions';
import { ArrowUpDown, Info } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Define constant values used throughout the component
const JUPITER_API = 'https://quote-api.jup.ag/v6'; // Jupiter API endpoint
const TOKEN_LIST_URL = 'https://token.jup.ag/strict'; // URL to fetch token list
const QUOTE_REFRESH_SECONDS = 15; // How often to refresh the swap quote
const MAX_RECENT_TRANSACTIONS = 5; // Maximum number of recent transactions to show

// Define TypeScript interfaces for type safety
export interface Token {
  address: string;     // Token's contract address
  symbol: string;      // Token's symbol (e.g., SOL, USDC)
  name: string;        // Token's full name
  decimals: number;    // Token's decimal places
  logoURI: string;     // URL for token's logo
}

// Interface for the quote response from Jupiter API
interface QuoteResponse {
  inputAmount: string;
  outputAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  priceImpactPct: number;
  routePlan: any[];
  contextSlot: number;
}

// Interface for transaction notifications
interface TxnNotification {
  txId: string;                    // Transaction ID
  timestamp: number;               // When the transaction occurred
  fromToken: string;              // Source token symbol
  toToken: string;                // Destination token symbol
  fromAmount: string;             // Amount being swapped
  toAmount: string;               // Amount being received
  status: 'success' | 'pending' | 'error'; // Transaction status
}

export const JupiterDexSwap: FC = () => {
  // Get Solana connection and wallet state from wallet adapter
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  // State management using React hooks
  const [tokens, setTokens] = useState<Token[]>([]); // List of all available tokens
  const [inputToken, setInputToken] = useState<Token | null>(null); // Selected input token
  const [outputToken, setOutputToken] = useState<Token | null>(null); // Selected output token
  const [inputAmount, setInputAmount] = useState(''); // Amount to swap
  const [quote, setQuote] = useState<QuoteResponse | null>(null); // Current swap quote
  const [loading, setLoading] = useState(false); // Loading state for swap execution
  const [isFetchingQuote, setIsFetchingQuote] = useState(false); // Loading state for quote fetching
  const [error, setError] = useState(''); // Error message state
  const [recentTxns, setRecentTxns] = useState<TxnNotification[]>([]); // List of recent transactions
  const [quoteRefreshTimer, setQuoteRefreshTimer] = useState(QUOTE_REFRESH_SECONDS); // Timer for quote refresh
  const [isRotating, setIsRotating] = useState(false); // Animation state for token switch button

  // Effect hook to fetch token list on component mount
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(TOKEN_LIST_URL);
        const tokenList = await response.json();
        setTokens(tokenList);

        // Set default tokens (SOL and USDC)
        const solToken = tokenList.find((t: Token) => t.symbol === 'SOL');
        const usdcToken = tokenList.find((t: Token) => t.symbol === 'USDC');
        if (solToken) setInputToken(solToken);
        if (usdcToken) setOutputToken(usdcToken);
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError('Failed to load token list');
      }
    };
    fetchTokens();
  }, []);

  // Effect hook to handle quote refresh timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quote && quoteRefreshTimer > 0) {
      timer = setInterval(() => {
        setQuoteRefreshTimer((prev) => prev - 1);
      }, 1000);
    } else if (quoteRefreshTimer === 0 && inputAmount) {
      fetchQuote(inputAmount);
      setQuoteRefreshTimer(QUOTE_REFRESH_SECONDS);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quoteRefreshTimer, quote, inputAmount]);

  // Function to fetch swap quote from Jupiter API
  const fetchQuote = useCallback(async (amount: string) => {
    if (!inputToken || !outputToken || !amount || Number(amount) <= 0) {
      setQuote(null);
      return;
    }

    try {
      setIsFetchingQuote(true);
      setError('');

      // Convert input amount to smallest units based on token decimals
      const inputAmountInSmallestUnits = (Number(amount) * Math.pow(10, inputToken.decimals)).toString();

      // Prepare API parameters
      const params = new URLSearchParams({
        inputMint: inputToken.address,
        outputMint: outputToken.address,
        amount: inputAmountInSmallestUnits,
        slippageBps: '50', // 0.5% slippage tolerance
      });

      // Fetch quote from Jupiter API
      const response = await fetch(`${JUPITER_API}/quote?${params}`);
      const quoteData = await response.json();

      if (quoteData.error) {
        throw new Error(quoteData.error);
      }

      setQuote(quoteData);
      setQuoteRefreshTimer(QUOTE_REFRESH_SECONDS);
    } catch (err) {
      console.error('Quote error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get quote');
      setQuote(null);
    } finally {
      setIsFetchingQuote(false);
    }
  }, [inputToken, outputToken]);

  // Handler for input amount changes
  const handleInputChange = (value: string) => {
    setInputAmount(value);
    if (value && inputToken && outputToken && Number(value) > 0) {
      fetchQuote(value);
    } else {
      setQuote(null);
    }
  };

  // Function to switch input and output tokens
  const switchTokens = () => {
    setIsRotating(true);
    const tempToken = inputToken;
    setInputToken(outputToken);
    setOutputToken(tempToken);
    if (inputAmount) fetchQuote(inputAmount);
    setTimeout(() => setIsRotating(false), 500);
  };

  // Function to execute the swap transaction
  const executeSwap = async () => {
    if (!publicKey || !quote || !inputToken || !outputToken) return;

    // Toast notification IDs for tracking different stages
    let prepToastId: string | number | undefined;
    let walletToastId: string | number | undefined;
    let sendingToastId: string | number | undefined;

    try {
      setLoading(true);
      setError('');
      
      // Show preparing transaction toast
      prepToastId = toast.loading('Preparing swap transaction...', {
        duration: Infinity
      });

      // Prepare swap request body
      const swapRequestBody = {
        quoteResponse: quote,
        userPublicKey: publicKey.toString(),
        wrapUnwrapSOL: true,
        computeUnitPriceMicroLamports: 1000
      };

      // Request swap transaction from Jupiter API
      const swapRes = await fetch(`${JUPITER_API}/swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(swapRequestBody),
      });

      if (!swapRes.ok) {
        const errorData = await swapRes.json();
        throw new Error(errorData.error || `Swap request failed: ${swapRes.status}`);
      }

      const swapData = await swapRes.json();

      if (swapData.error) {
        throw new Error(swapData.error);
      }

      // Update toast to wallet approval stage
      if (prepToastId) toast.dismiss(prepToastId);
      walletToastId = toast.loading('Waiting for wallet approval...', {
        duration: Infinity
      });

      // Deserialize and sign transaction
      const serializedTransaction = Buffer.from(swapData.swapTransaction, 'base64');
      const version = serializedTransaction[0];

      let transaction;
      if (version === 0) {
        transaction = Transaction.from(serializedTransaction);
      } else {
        const { VersionedTransaction } = await import('@solana/web3.js');
        transaction = VersionedTransaction.deserialize(serializedTransaction);
      }

      const signedTx = await window.solana.signTransaction(transaction);
      
      // Update toast to sending transaction stage
      if (walletToastId) toast.dismiss(walletToastId);
      sendingToastId = toast.loading('Sending transaction...', {
        duration: Infinity
      });

      // Send transaction to network
      const rawTransaction = signedTx.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3,
      });

      // Create new transaction notification
      const newTxn: TxnNotification = {
        txId: txid,
        timestamp: Date.now(),
        fromToken: inputToken.symbol,
        toToken: outputToken.symbol,
        fromAmount: inputAmount,
        toAmount: quote ? (Number(quote.otherAmountThreshold) / Math.pow(10, outputToken.decimals)).toFixed(6) : '0',
        status: 'pending'
      };

      // Update recent transactions list
      setRecentTxns(prev => [newTxn, ...prev].slice(0, MAX_RECENT_TRANSACTIONS));

      // Wait for transaction confirmation
      const confirmation = await connection.confirmTransaction(txid, 'confirmed');

      if (sendingToastId) toast.dismiss(sendingToastId);

      if (confirmation.value.err) {
        throw new Error('Transaction failed to confirm');
      }

      // Show success toast with Solscan link
      toast.success(
        <div className="flex flex-col">
          <span>Swap successful!</span>
          <a
            href={`https://solscan.io/tx/${txid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:text-blue-600"
          >
            View on Solscan
          </a>
        </div>,
        { duration: 5000
      });

      // Update transaction status to success
      setRecentTxns(prev =>
        prev.map(tx =>
          tx.txId === txid ? { ...tx, status: 'success' } : tx
        )
      );

      // Reset input fields
      setInputAmount('');
      setQuote(null);
    } catch (err) {
      // Dismiss all toasts on error
      if (prepToastId) toast.dismiss(prepToastId);
      if (walletToastId) toast.dismiss(walletToastId);
      if (sendingToastId) toast.dismiss(sendingToastId);

      console.error('Swap error:', err);
      toast.error('Swap failed: ' + (err instanceof Error ? err.message : 'Unknown error'), {
        duration: 5000
      });
      setError(err instanceof Error ? err.message : 'Swap failed');
    } finally {
      setLoading(false);
    }
  };

  // Component UI render
  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Main swap card */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-2">
        <CardContent className="space-y-6">
          {/* Header with title and wallet button */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Solana Dex
            </h2>
            <SolanaWalletsButton />
          </div>

          {/* Swap interface container */}
          <div className="relative">
            {/* Input (You Pay) section */}
            <div className="p-4 rounded-lg bg-secondary/30">
              <label className="text-sm text-muted-foreground">You Pay</label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="number"
                  value={inputAmount}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="0.0"
                  disabled={!connected}
                  className="text-lg bg-transparent border-none focus-visible:ring-0"
                />
                <TokenSelect
                  tokens={tokens}
                  selectedToken={inputToken}
                  onSelect={(token) => {
                    setInputToken(token);
                    if (inputAmount) fetchQuote(inputAmount);
                  }}
                  disabled={!connected}
                />
              </div>
            </div>

            {/* Token switch button */}
            <motion.button
              className="absolute left-1/2 -translate-x-1/2 top-1/2 z-10 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              onClick={switchTokens}
              animate={{ rotate: isRotating ? 180 : 0 }}
              whileHover={{ scale: 1.1 }}
            >
              <ArrowUpDown className="w-4 h-4" />
            </motion.button>

            {/* Output (You Receive) section */}
            <div className="p-4 rounded-lg bg-secondary/30 mt-2">
              <label className="text-sm text-muted-foreground">You Receive</label>
              <div className="flex gap-2 mt-1">
                <div className="relative flex-1">
                  <Input
                    readOnly
                    value={
                      quote && outputToken
                        ? `${(Number(quote.otherAmountThreshold) / Math.pow(10, outputToken.decimals || 1)).toFixed(6)}`
                        : '0.0'
                    }
                    placeholder="0.0"
                    className="text-lg bg-transparent border-none w-full"
                  />
                  {/* Loading spinner for quote fetching */}
                  {isFetchingQuote && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <TokenSelect
                  tokens={tokens}
                  selectedToken={outputToken}
                  onSelect={(token) => {
                    setOutputToken(token);
                    if (inputAmount) fetchQuote(inputAmount);
                  }}
                  disabled={!connected}
                />
              </div>
            </div>
          </div>

          {/* Quote information card */}
          {quote && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-secondary/20 space-y-2"
            >
              {/* Price impact display */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price Impact:</span>
                <span className={`${Number(quote.priceImpactPct) > 1 ? 'text-red-400' : 'text-green-400'}`}>
                  {(quote.priceImpactPct * 100).toFixed(2)}%
                </span>
              </div>
              {/* Minimum received amount */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Minimum Received:</span>
                <span>
                  {(Number(quote.otherAmountThreshold) / Math.pow(10, outputToken?.decimals || 1)).toFixed(6)} {outputToken?.symbol}
                </span>
              </div>
              {/* Quote refresh timer */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quote refreshes in:</span>
                <motion.span
                  key={quoteRefreshTimer}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className={quoteRefreshTimer <= 5 ? 'text-orange-400' : ''}
                >
                  {quoteRefreshTimer}s
                </motion.span>
              </div>
            </motion.div>
          )}

          {/* Swap button */}
          <Button
            onClick={executeSwap}
            disabled={!connected || !quote || loading || isFetchingQuote}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {loading ? 'Processing...' : isFetchingQuote ? 'Fetching Quote...' : 'Swap'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent transactions list with animation */}
      <AnimatePresence>
        {recentTxns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <RecentTransactions transactions={recentTxns} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};