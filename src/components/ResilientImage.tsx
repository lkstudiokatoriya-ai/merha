import React, { useState } from 'react';
import { Mountain } from 'lucide-react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
  containerClassName?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackLabel,
  containerClassName = '',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0D2129] via-[#122D28] to-[#1A2E22] text-amber-200/80 p-6 text-center ${containerClassName} ${className}`}
      >
        <Mountain className="w-8 h-8 mb-2 text-amber-400/80 stroke-[1.5]" />
        <span className="text-xs font-medium tracking-wide text-stone-300">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
      {...props}
    />
  );
};
