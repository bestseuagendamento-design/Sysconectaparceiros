import React from 'react';
import { cn } from './utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
}

export function GlassCard({ 
  children, 
  className, 
  blur = 'md',
  opacity = 0.8 
}: GlassCardProps) {
  const blurValues = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl border border-white/20 shadow-2xl',
        blurValues[blur],
        className
      )}
      style={{
        background: `rgba(255, 255, 255, ${opacity})`,
      }}
    >
      {/* Glass shine effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
