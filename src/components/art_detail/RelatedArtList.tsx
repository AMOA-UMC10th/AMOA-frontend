import { useNavigate } from 'react-router-dom';
import type { NailCard } from '../../data/nailData';
import ArtCard from '../common/ArtCard';

interface RelatedArtListProps {
  cards: NailCard[];
}

export default function RelatedArtList({ cards }: RelatedArtListProps) {
  const navigate = useNavigate();

  return (
    <div className="py-6">
      <h3 className="px-4 text-base font-bold text-[#171B1C] mb-3">
        연관 추천 아트
      </h3>
      <div className="grid grid-cols-2 gap-0.5 gap-y-5">
        {cards.map((card) => (
          <ArtCard
            key={card.card_id}
            cardId={card.card_id}
            instagramUrl={card.instagram_url}
            shopName={card.shop_name}
            regionName={card.region_name}
            minPrice={card.min_price}
            maxPrice={card.max_price}
            artType={card.art_type}
          />
        ))}
      </div>
    </div>
  );
}