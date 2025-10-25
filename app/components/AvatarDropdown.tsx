'use client';

import { useState, useRef, useEffect } from 'react';
import Avatar from 'boring-avatars';
import { usePrivy } from '@privy-io/react-auth';

export default function AvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = usePrivy();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const userIdentifier = user?.wallet?.address || user?.email?.address || 'user';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full border-2 border-zinc-800 hover:border-primary transition-all"
      >
        <Avatar
          size={40}
          name={userIdentifier}
          variant="pixel"
          colors={['#FF6B35', '#F7931E', '#FDC830', '#4ECDC4', '#1A535C']}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl z-50">
          <div className="p-3 border-b border-zinc-800">
            <p className="text-xs text-zinc-500">Connected as</p>
            <p className="text-sm font-medium truncate mt-1">
              {user?.wallet?.address
                ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                : user?.email?.address || 'Anonymous'}
            </p>
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to profile page
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-900 transition-colors"
            >
              View Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-zinc-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

