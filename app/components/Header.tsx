'use client';

import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import AvatarDropdown from './AvatarDropdown';

export default function Header() {
  const { ready, authenticated, login } = usePrivy();

  return (
    <header className="border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/matchbox.png"
            alt="Matchbox"
            width={40}
            height={40}
            className="rounded"
          />
          <h1 className="text-xl font-bold tracking-tight">MATCHBOX</h1>
        </div>
        
        {!ready ? (
          <div className="h-10 w-24 bg-zinc-900 animate-pulse rounded" />
        ) : authenticated ? (
          <AvatarDropdown />
        ) : (
          <button
            onClick={login}
            className="px-4 py-2 rounded font-medium transition-all bg-zinc-900 border border-zinc-800 hover:border-primary"
          >
            LOGIN
          </button>
        )}
      </div>
    </header>
  );
}

