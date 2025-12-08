'use client';

import { useSession } from 'next-auth/react';
import { SignOutButton } from './SignOutButton';
import Image from 'next/image';

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User'}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
            {session.user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {session.user.name}
          </span>
          <span className="text-xs text-gray-500">{session.user.email}</span>
        </div>
      </div>
      <SignOutButton />
    </div>
  );
}

