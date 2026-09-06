import React from 'react';

interface MentraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  theme?: 'light' | 'dark' | 'black';
  onClick?: () => void;
}

export const MentraLogo: React.FC<MentraLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  theme = 'light',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 rounded-xl text-base',
    md: 'w-9 h-9 rounded-2xl text-xl',
    lg: 'w-12 h-12 rounded-2xl text-2xl',
    xl: 'w-16 h-16 rounded-3xl text-3xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3.5 h-3.5',
  };

  const isDarkOrBlack = theme === 'dark' || theme === 'black';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      id="mentra-brand-logo"
    >
      {/* Squircle Icon with curved M matching uploaded branding */}
      <div
        className={`${iconSizes[size]} bg-[#4F46E5] flex items-center justify-center shadow-sm flex-shrink-0 transition-transform hover:scale-105`}
        style={{
          boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.35)',
        }}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-3/5 h-3/5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bold geometric rounded M */}
          <path
            d="M8 29.5V13C8 11.6193 9.11929 10.5 10.5 10.5C11.8807 10.5 13 11.6193 13 13V24.5L18.4142 19.0858C19.1953 18.3047 20.8047 18.3047 21.5858 19.0858L27 24.5V13C27 11.6193 28.1193 10.5 29.5 10.5C30.8807 10.5 32 11.6193 32 13V29.5C32 30.8807 30.8807 32 29.5 32C28.5 32 27.6 31.4 27.2 30.6L20 22.8L12.8 30.6C12.4 31.4 11.5 32 10.5 32C9.11929 32 8 30.8807 8 29.5Z"
            fill="white"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-1.5 font-bold tracking-tight">
          <span
            className={`${textSizes[size]} font-extrabold transition-colors ${
              isDarkOrBlack ? 'text-white' : 'text-[#111827]'
            }`}
            style={{ letterSpacing: '-0.03em' }}
          >
            Mentra
          </span>
          {/* Characteristic brand dot matching Image 1 */}
          <span
            className={`${dotSizes[size]} rounded-full bg-[#4F46E5] inline-block ml-0.5 animate-pulse`}
          />
        </div>
      )}
    </div>
  );
};
