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
  cropHeight?: number; // full variant에서 자르는 높이
}

// 아래 숫자들은 실제 화면 보면서 조정하는 값
const DEFAULT_FULL_CROP_HEIGHT = 480; // 상세페이지 상단용 기본 크롭 높이
const THUMBNAIL_SCALE = 0.55; // 좁은 칸에서 인스타 임베드를 축소하는 배율 (326px 기준)
const THUMBNAIL_VISIBLE_HEIGHT = 200; // 축소 후 실제로 보여줄 세로 칸 높이 (계정정보+이미지 정도)

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
    // 인스타 임베드 최소너비(326px) 자체를 축소해서, 좁은 칸 안에 실제 크기로 보이게 함
    return (
      <div
        className="w-full overflow-hidden rounded-xl bg-[#E9EBEE]"
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

  // variant === 'full': 위(계정정보+이미지)는 보이고, 아래(좋아요/댓글/캡션)만 잘림
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
