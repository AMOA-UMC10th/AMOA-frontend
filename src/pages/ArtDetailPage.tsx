//아트 상세 페이지 (C101)

import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import InstagramEmbed from '../components/art_detail/InstagramEmbed';
import ArtLikeBtn from '../components/common/ArtLikeBtn';
import RelatedArtList from '../components/art_detail/RelatedArtList';
import KakaoMoveModal from '../components/art_detail/KakaoMoveModal';
import {
  ChevronLeftIcon,
  AddressPinIcon,
  ShareIcon,
  KakaoIcon,
} from '../assets/icons';
import { mockCardResponse, type NailCard } from '../data/nailData';

export default function ArtDetailPage() {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const [showKakaoModal, setShowKakaoModal] = useState(false);

  const card: NailCard =
    mockCardResponse.result.cards.find((c) => c.card_id === Number(cardId)) ??
    mockCardResponse.result.cards[0];

  const relatedCards = mockCardResponse.result.cards.filter(
    (c) => c.card_id !== card.card_id,
  );

  const designTags = ['아기자기', '파스텔', '화려함'];

  const handleShopClick = () => {
    navigate(`/shop/${card.shop_name}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: card.shop_name,
          url: window.location.href,
        })
        .catch(() => {});
    }
  };

  return (
    <div className="w-full pb-24">
      <div className="relative flex items-center justify-center px-4 py-3">
        <button onClick={() => navigate(-1)} className="absolute left-4">
          <ChevronLeftIcon className="w-5 h-5 text-[#171B1C]" />
        </button>
        <span className="text-sm font-bold">아트 상세</span>
      </div>

      <div className="px-1">
        <InstagramEmbed postUrl={card.instagram_url} />
      </div>

      <button
        onClick={handleShopClick}
        className="flex items-center gap-2 px-4 py-4 w-full"
      >
        <span className="w-9 h-9 rounded-full bg-[#E9EBEE] shrink-0" />
        <div className="text-left">
          <p className="text-sm font-bold text-[#171B1C]">{card.shop_name}</p>
          <p className="text-xs text-[#ADB0B5] flex items-center gap-0.5">
            <AddressPinIcon className="w-3 h-3 text-[#ADB0B5]" />
            {card.region_name}
          </p>
        </div>
      </button>

      <div className="border-t border-[#E9EBEE] mx-4 mb-4" />

      <div className="px-4 py-1">
        <p className="text-xs text-[#646F7C] font-bold mb-1">
          {card.art_type === 'MONTHLY'
            ? `${Number(card.created_month.split('-')[1])}월 이달의 아트`
            : '이벤트 아트'}
        </p>
        <p className="text-lg font-bold text-[#171B1C] mb-3">
          {card.min_price.toLocaleString()}~{card.max_price.toLocaleString()}원
        </p>

        {designTags.length > 0 && (
          <div className="py-1">
            <p className="text-xs text-[#646F7C] font-bold mb-2">디자인 태그</p>
            <div className="flex flex-wrap gap-2">
              {designTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-[#F70071] bg-[#FFEEF6] px-3 py-1.5 rounded-full font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <RelatedArtList cards={relatedCards} />

      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 bg-white border-t border-[#E9EBEE] flex items-center gap-9 px-4 py-3">
        <ArtLikeBtn initialLiked={card.is_liked} />
        <button onClick={handleShare} aria-label="공유하기">
          <ShareIcon className="w-5 h-6 text-[#171B1C]" />
        </button>
        <button
          onClick={() => setShowKakaoModal(true)}
          className="w-[70%] bg-[#171B1C] text-white rounded-lg py-3 text-sm font-bold flex items-center justify-center gap-2 shrink-0"
        >
          <KakaoIcon className="w-4 h-4" />
          카카오로 시작하기
        </button>
      </div>

      <KakaoMoveModal
        isOpen={showKakaoModal}
        onClose={() => setShowKakaoModal(false)}
        shopName={card.shop_name}
      />
    </div>
  );
}