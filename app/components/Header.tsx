'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import AvatarDropdown from './AvatarDropdown';

export default function Header() {
  const { ready, authenticated, login } = usePrivy();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo and Desktop Nav */}
        <div className="flex items-center gap-8">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/matchbox.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Whitepaper
            </a>
            <span className="text-sm font-medium text-zinc-600 cursor-not-allowed">
              API Docs <span className="text-xs">(soon)</span>
            </span>
          </nav>
        </div>

        {/* Right Side: Auth + Mobile Menu */}
        <div className="flex items-center gap-3">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-zinc-900 rounded transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            <a
              href="/matchbox.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Whitepaper
            </a>
            <span className="text-sm font-medium text-zinc-600 cursor-not-allowed">
              API Docs <span className="text-xs">(soon)</span>
            </span>
          </nav>
        </div>
      )}
    </header>
  );
}

