import type { SyntheticEvent } from 'react';

interface Props {
  src?: string;
  alt: string;
  className?: string;
}

export default function PlaceholderImage({ src, alt, className }: Props) {
  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      'data:image/svg+xml;base64,' +
      btoa(`
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#e8f0fe"/>
          <text x="200" y="140" text-anchor="middle"
            font-family="Arial" font-size="48" fill="#93c5fd">✈</text>
          <text x="200" y="185" text-anchor="middle"
            font-family="Arial" font-size="16" fill="#60a5fa">No Image</text>
        </svg>
      `);
  };

  return (
    <img
      src={src || 'invalid'}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
