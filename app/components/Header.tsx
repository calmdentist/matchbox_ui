'use client';

import Image from 'next/image';

type HeaderProps = {
  connected: boolean;
  onConnectClick: () => void;
};

export default function Header({ connected, onConnectClick }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/matchbox.png"
            alt="Matchbox"
            width={48}
            height={48}
            className="rounded"
          />
          <h1 className="text-xl font-bold tracking-tight">MATCHBOX</h1>
        </div>
        <button
          onClick={onConnectClick}
          className={`px-4 py-2 rounded font-medium transition-all ${
            connected
              ? 'bg-primary text-white hover:opacity-80'
              : 'bg-zinc-900 border border-zinc-800 hover:border-primary'
          }`}
        >
          {connected ? 'CONNECTED' : 'CONNECT WALLET'}
        </button>
      </div>
    </header>
  );
}

