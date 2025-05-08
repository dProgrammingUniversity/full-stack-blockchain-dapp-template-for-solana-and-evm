'use client';

import { FC } from 'react';
import { Card } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';

interface Transaction {
  txId: string;
  timestamp: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  status: 'success' | 'pending' | 'error';
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <Card className="mt-4 p-4">
      <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div key={tx.txId} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
            <div className="flex flex-col">
              <span className="text-sm">
                {tx.fromAmount} {tx.fromToken} → {tx.toAmount} {tx.toToken}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(tx.timestamp).toLocaleString()}
              </span>
            </div>
            <a
              href={`https://solscan.io/tx/${tx.txId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
};
