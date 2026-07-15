// 인스타그램 공식 임베드 렌더링 (index.html에 embed.js 전역 로드됨)
// thumbnail variant만 pointer-events-none 적용 (클릭이 부모 카드 버튼으로 전달되게 함)
// full variant는 클릭 가능하게 유지 (인스타그램 자체 클릭 시 원본 게시물로 이동)

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

const DEFAULT_FULL_CROP_HEIGHT = 480;
const THUMBNAIL_SCALE = 0.55;
const THUMBNAIL_VISIBLE_HEIGHT = 200;

export default function InstagramEmbed({
  postUrl,
  variant = 'full',
  cropHeight = DEFAULT_FULL_CROP_HEIGHT,
}: InstagramEmbedProps) {
  useEffect(() => {
    window.instgrm?.Embeds.process();
  }, [postUrl]);

  if (!postUrl) {
    return (
      <div className="w-full aspect-square flex items-center justify-center bg-[#E9EBEE] text-xs text-[#ADB0B5] rounded-xl">
        인스타그램 게시물 준비중
      </div>
    );
  }

  if (variant === 'thumbnail') {
    return (
      <div
        className="w-full overflow-hidden rounded-xl bg-[#E9EBEE] pointer-events-none"
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
      className="w-full overflow-hidden rounded-xl bg-[#E9EBEE]"
      style={{ height: cropHeight }}
    >
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={postUrl}
        data-instgrm-version="14"
        style={{ margin: 0, width: '100%' }}
      />
    </div>
  );
}
