// C101 연관 추천 아트

import { useNavigate } from 'react-router-dom';
import InstagramEmbed from './InstagramEmbed';
import { AddressPinIcon } from '../../assets/icons';
import type { NailCard } from '../../data/naildata';

interface RelatedArtListProps {
  cards: NailCard[];
}

export default function RelatedArtList({ cards }: RelatedArtListProps) {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      <h3 className="text-base font-bold text-[#171B1C] mb-3">
        연관 추천 아트
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <button
            key={card.card_id}
            onClick={() => navigate(`/art/${card.card_id}`)}
            className="text-left min-w-0 flex flex-col gap-1"
          >
            <InstagramEmbed postUrl={card.instagram_url} variant="thumbnail" />
            <span className="inline-block mt-1 text-[10px] text-[#646F7C] font-bold bg-[#FDF2F5] rounded px-1 py-0.5 leading-tight w-fit">
              {card.art_type === 'MONTHLY'
                ? `${Number(card.created_month.split('-')[1])}월 이달아`
                : '이벤트'}
            </span>
            <p className="text-sm font-bold text-[#171B1C]">{card.shop_name}</p>
            <p className="text-xs text-[#ADB0B5] flex items-center gap-0.5">
              <AddressPinIcon className="w-2.5 h-2.5 text-[#ADB0B5]" />
              {card.region_name}
            </p>
            <p className="text-xs text-[#646F7C] font-bold">
              {card.min_price.toLocaleString()}~
              {card.max_price.toLocaleString()}원
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
