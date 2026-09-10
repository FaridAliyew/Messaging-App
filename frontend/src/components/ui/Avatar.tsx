import React, { useState } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarUser {
  displayName?: string;
  username: string;
  avatarUrl?: string;
}

interface AvatarProps {
  user?: AvatarUser;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-xs',
  lg: 'h-14 w-14 text-sm',
  xl: 'h-24 w-24 text-xl',
};

/**
 * Deterministic color palette for initials badges.
 * Picks one of 5 warm tone variants based on username char code sum.
 * Avoids every user having the same fallback color.
 */
const BADGE_COLORS = [
  'bg-[#3D2E1E] text-[#E5A24E]',   // warm amber
  'bg-[#1E2D3D] text-[#5AABDF]',   // cool blue
  'bg-[#2D1E3D] text-[#A87FE5]',   // muted violet
  'bg-[#1E3D2D] text-[#5ADF9A]',   // muted teal
  'bg-[#3D1E2D] text-[#E57FA8]',   // dusty rose
];

function getBadgeColor(username: string): string {
  const sum = username.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return BADGE_COLORS[sum % BADGE_COLORS.length];
}

export const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className = '' }) => {
  const [imgError, setImgError] = useState(false);

  const name = user?.displayName || user?.username || '?';
  const initials = name.slice(0, 2).toUpperCase();
  const badgeColor = getBadgeColor(user?.username || '?');

  const sizeClass = sizeClasses[size];
  const baseClass = `${sizeClass} rounded-full shrink-0 ${className}`;

  if (user?.avatarUrl && !imgError) {
    return (
      <img
        src={user.avatarUrl}
        alt={name}
        onError={() => setImgError(true)}
        className={`${baseClass} object-cover border border-border`}
      />
    );
  }

  return (
    <div
      className={`${baseClass} ${badgeColor} flex items-center justify-center font-bold`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
