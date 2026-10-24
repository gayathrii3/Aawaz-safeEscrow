import React from 'react';

interface AawazLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withEcho?: boolean;
}

export const AawazLogo: React.FC<AawazLogoProps> = ({ 
  className = '', 
  size = 'md',
  withEcho = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      {withEcho && (
        <>
          {/* Outer Echo Waves expanding like sound ripples */}
          <span 
            className="absolute inset-0 rounded-full border border-rose-400/40 bg-rose-400/25 animate-echo-wave pointer-events-none" 
            style={{ animationDelay: '0s' }}
          />
          <span 
            className="absolute inset-0 rounded-full border border-rose-300/30 bg-rose-300/15 animate-echo-wave pointer-events-none" 
            style={{ animationDelay: '1.2s' }}
          />
        </>
      )}
      
      {/* Central Popping / Breathing Logo Image */}
      <img
        src="/logo.png"
        alt="Aawaz Logo"
        className="relative z-10 w-full h-full object-contain rounded-full shadow-md drop-shadow-sm hover:scale-110 active:scale-95 transition-transform duration-300 animate-pop-subtle"
      />
    </div>
  );
};
