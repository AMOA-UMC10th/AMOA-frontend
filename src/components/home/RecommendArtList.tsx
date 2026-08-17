import { useEffect } from 'react';
import type { RecommendedCard } from '../../data/card';
import ArtCard from '../common/ArtCard';
import ArtCardSkeleton from '../common/ArtCardSkeleton';

interface RecommendArtListProps {
  items: RecommendedCard[];
  loading?: boolean;
  skeletonCount?: number;
}

export default function RecommendArtList({
  items,
  loading = false,
  skeletonCount = 2,
}: RecommendArtListProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [items]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-x-0.5 gap-y-5 pb-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ArtCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-0.5 gap-y-5 pb-4">
      {items && items.length > 0 ? (
        items.map((item, index) => (
          <ArtCard
            key={item.cardId || `art-card-${index}`}
            cardId={item.cardId}
            instagramUrl={item.instagramUrl}
            shopName={item.shopName}
            regionName={item.regionName}
            minPrice={item.minPrice}
            maxPrice={item.maxPrice}
            artType={item.artType || 'ART'}
            isLiked={item.isLiked ?? false}
            createdMonth={item.createdMonth}
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