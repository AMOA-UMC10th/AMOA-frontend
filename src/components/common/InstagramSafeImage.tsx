import { useState, useEffect, useRef } from 'react';

export default function InstagramSafeImage({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const targetWidth = 326; // 인스타 기본 최소 가로폭 기준
        if (width > 0) {
          setScale(width / targetWidth);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!url || url.trim() === '') {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-100">
        이미지가 없습니다.
      </div>
    );
  }

  const cleanUrl = url.split('?')[0];
  const embedUrl = `${cleanUrl}${cleanUrl.endsWith('/') ? '' : '/'}embed/?captioned=false`;

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#E9EBEE]">
      <div
        className="absolute origin-top-left"
        style={{
          width: '326px',
          height: '435px', // 3:4 세로 비율 유지 (326 * 4/3)
          transform: `scale(${scale})`,
          top: '0px',      // 자르지 않고 맨 위부터 보이도록 0px로 고정
          left: '0px',
        }}
      >
        <iframe
          src={embedUrl}
          className="w-full h-full border-0 pointer-events-none"
          scrolling="no"
          title="Instagram Image"
          loading="lazy"
        />
      </div>
    </div>
  );
}
