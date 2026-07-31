import { useState, useEffect, useRef } from 'react';

export default function InstagramSafeImage({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const targetWidth = 326;
        if (width > 0) {
          setScale(width / targetWidth);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [url]);

  if (!url || url.trim() === '') {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-100">
        이미지가 없습니다.
      </div>
    );
  }

  const cleanUrl = url.split('?')[0];
  const formattedUrl = cleanUrl.endsWith('/') ? cleanUrl : `${cleanUrl}/`;

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#E9EBEE]">
      <div
        className="absolute origin-top-left"
        style={{
          width: '328px',
          height: '470px',
          transform: `scale(${scale})`,
          top: '-1px',
          left: '-1px',
        }}
      >
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={formattedUrl}
          data-instgrm-version="14"
          style={{
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
          }}
        >
          <a href={formattedUrl} target="_blank" rel="noopener noreferrer"></a>
        </blockquote>
      </div>
    </div>
  );
}