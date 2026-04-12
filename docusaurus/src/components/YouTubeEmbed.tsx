import React from 'react';

interface YouTubeEmbedProps {
  /** YouTube video ID (the part after ?v= or /shorts/) */
  id: string;
  /** Accessible title for the iframe */
  title: string;
  /** Optional caption shown below the embed */
  caption?: string;
  /** Optional start time in seconds */
  start?: number;
}

/**
 * Privacy-enhanced, responsive YouTube embed.
 * Uses youtube-nocookie.com — no cookies set until the user clicks play.
 */
export default function YouTubeEmbed({ id, title, caption, start }: YouTubeEmbedProps): JSX.Element {
  const src = `https://www.youtube-nocookie.com/embed/${id}${start ? `?start=${start}` : ''}`;

  return (
    <figure style={{ margin: '1.5rem 0' }}>
      <div
        style={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9
          height: 0,
          overflow: 'hidden',
          borderRadius: '10px',
          border: '1px solid var(--ifm-color-emphasis-200)',
          background: '#000',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
      {caption && (
        <figcaption
          style={{
            textAlign: 'center',
            fontSize: '0.82rem',
            marginTop: '0.5rem',
            opacity: 0.65,
            fontStyle: 'italic',
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
