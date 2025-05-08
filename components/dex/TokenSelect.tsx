// components/dex/TokenSelect.tsx
'use client';

import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Token } from '@/components/dex/JupiterDexSwap';
import { FC } from 'react';

interface TokenSelectProps {
  tokens: Token[];
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
  disabled?: boolean;
}

export const TokenSelect: FC<TokenSelectProps> = ({ tokens, selectedToken, onSelect, disabled }) => {
  const [open, setOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (tokenAddress: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [tokenAddress]: false
    }));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between"
          disabled={disabled}
        >
          {selectedToken ? (
            <div className="flex items-center gap-2">
              {selectedToken.logoURI && loadedImages[selectedToken.address] !== false && (
                <img 
                  src={selectedToken.logoURI} 
                  alt={selectedToken.symbol}
                  className="w-6 h-6 rounded-full"
                  onError={() => handleImageError(selectedToken.address)}
                />
              )}
              {selectedToken.symbol}
            </div>
          ) : 'Select token'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search token..." />
          <CommandEmpty>No token found</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {tokens.map((token) => (
              <CommandItem
                key={token.address}
                value={token.symbol}
                onSelect={() => {
                  onSelect(token);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {token.logoURI && loadedImages[token.address] !== false && (
                    <img 
                      src={token.logoURI} 
                      alt={token.symbol}
                      className="w-6 h-6 rounded-full"
                      onError={() => handleImageError(token.address)}
                    />
                  )}
                  <span className="font-medium">{token.symbol}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};