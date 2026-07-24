import { useEffect } from 'react';
import type { NailCard } from '../../data/mockupdata/nailData';
import ArtCard from '../common/ArtCard';

interface RecommendArtListProps {
  items: NailCard[];
}

export default function RecommendArtList({ items }: RecommendArtListProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [items]);

  return (
    <div className="grid grid-cols-2 gap-x-0.5 gap-y-5 pb-4">
      {items && items.length > 0 ? (
        items.map((item, index) => (
          <ArtCard
            key={item.card_id || `art-card-${index}`}
            cardId={item.card_id}
            instagramUrl={item.instagram_url}
            shopName={item.shop_name}
            regionName={item.region_name}
            minPrice={item.min_price}
            maxPrice={item.max_price}
            artType={item.art_type || 'ART'} 
            isLiked={false}
          />
        ))
      ) : (
        <div className="col-span-2 text-center py-10 text-gray-400 text-sm">
          추천해 드릴 아트를 찾지 못했습니다.
        </div>
      )}
    </div>
  );
}