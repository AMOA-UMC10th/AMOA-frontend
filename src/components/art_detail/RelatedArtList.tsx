//C101 연관 추천 아트

import { useNavigate } from 'react-router-dom';
import type { NailCard } from '../../data/nailData';
import InstagramEmbed from './InstagramEmbed';

interface RelatedArtListProps {
  cards: NailCard[];
}

export default function RelatedArtList({ cards }: RelatedArtListProps) {
  const navigate = useNavigate();

  return (
    <div className="px-4">
      <h3 className="text-base font-bold text-[#171B1C] mb-3">
        연관 추천 아트
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <button
            key={card.card_id}
            onClick={() => navigate(`/art/${card.card_id}`)}
            className="text-left"
          >
            <InstagramEmbed postUrl={card.instagram_url} variant="thumbnail" />{' '}
            <p className="mt-2 text-sm font-bold text-[#171B1C]">
              {card.shop_name}
            </p>
            <p className="text-xs text-[#ADB0B5]">📍 {card.region_name}</p>
            <p className="text-xs text-[#646F7C]">
              {card.min_price.toLocaleString()}~
              {card.max_price.toLocaleString()}원
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
