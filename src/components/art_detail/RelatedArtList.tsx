import type { RecommendedCard } from '../../data/card';
import ArtCard from '../common/ArtCard';

interface RelatedArtListProps {
  cards: RecommendedCard[];
}

export default function RelatedArtList({ cards }: RelatedArtListProps) {
  return (
    <div className="py-6">
      <h3 className="px-4 text-base font-bold text-[#171B1C] mb-3">
        연관 추천 아트
      </h3>
      <div className="grid grid-cols-2 gap-0.5 gap-y-5">
        {cards.map((card) => (
          <ArtCard
            key={card.cardId}
            cardId={card.cardId}
            instagramUrl={card.instagramUrl}
            shopName={card.shopName}
            regionName={card.regionName}
            minPrice={card.minPrice}
            maxPrice={card.maxPrice}
            artType={card.artType}
            isLiked={card.isLiked}
          />
        ))}
      </div>
    </div>
  );
}