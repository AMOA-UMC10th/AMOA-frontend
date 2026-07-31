// 인스타그램 공식 임베드 렌더링 (index.html에 embed.js 전역 로드됨)

import { useEffect } from 'react';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

interface InstagramEmbedProps {
  postUrl: string;
  variant?: 'full' | 'thumbnail';
  cropHeight?: number;
}

const THUMBNAIL_SCALE = 0.55;
const THUMBNAIL_VISIBLE_HEIGHT = 200;

export default function InstagramEmbed({
  postUrl,
  variant = 'full',
  cropHeight,
}: InstagramEmbedProps) {
  useEffect(() => {
    window.instgrm?.Embeds.process();
  }, [postUrl]);

  if (!postUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#E9EBEE] text-xs text-[#ADB0B5]">
        인스타그램 게시물 준비중
      </div>
    );
  }

  if (variant === 'thumbnail') {
    return (
      <div
        className="w-full overflow-hidden bg-[#E9EBEE] pointer-events-none"
        style={{ height: THUMBNAIL_VISIBLE_HEIGHT }}
      >
        <div
          style={{
            width: `${100 / THUMBNAIL_SCALE}%`,
            transform: `scale(${THUMBNAIL_SCALE})`,
            transformOrigin: 'top left',
          }}
        >
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={postUrl}
            data-instgrm-version="14"
            style={{ margin: 0, width: '100%' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full bg-[#E9EBEE] flex justify-center items-start overflow-hidden"
      style={cropHeight ? { height: cropHeight } : undefined}
    >
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={postUrl}
        data-instgrm-version="14"
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          minWidth: '100%',
          border: 'none',
        }}
      />
    </div>
  );
}