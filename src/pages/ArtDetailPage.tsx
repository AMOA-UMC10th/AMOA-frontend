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
import { mockCardResponse, type NailCard } from '../data/naildata';

export default function ArtDetailPage() {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const [showKakaoModal, setShowKakaoModal] = useState(false);

  // TODO: GET /api/cards/{card_id} 로 교체
  const card: NailCard =
    mockCardResponse.result.cards.find((c) => c.card_id === Number(cardId)) ??
    mockCardResponse.result.cards[0];

  const relatedCards = mockCardResponse.result.cards.filter(
    (c) => c.card_id !== card.card_id,
  );

  const handleShopClick = () => {
    // TODO: D101(네일샵 상세) merge 시 실제 라우트 연결
    navigate(`/shop/${card.shop_name}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: card.shop_name,
          url: window.location.href,
        })
        .catch(() => {
          /* 사용자가 취소한 경우 등은 무시 */
        });
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

      {/* 인스타 임베드 */}
      <div className="px-1">
        <InstagramEmbed postUrl={card.instagram_url} />
      </div>

      {/* 샵 정보 */}
      <button
        onClick={handleShopClick}
        className="flex items-center gap-2 px-4 py-4 w-full"
      >
        <span className="w-9 h-9 rounded-full bg-[#E9EBEE] shrink-0" />
        <div className="text-left">
          <p className="text-sm font-bold text-[#171B1C]">{card.shop_name}</p>
          <p className="text-xs text-[#ADB0B5] flex items-center gap-0.5">
            <AddressPinIcon className="w-3 h-3 text-[#ADB0B5]" />
            {/* TODO: 입점신청 페이지(미구현)에서 등록될 상세 주소로 교체 예정. 지금은 region_name(구 단위) 임시 사용 */}
            {card.region_name}
          </p>
        </div>
      </button>

      {/* 구분선 */}
      <div className="border-t border-[#E9EBEE] mx-4 mb-4" />

      {/* 가격 정보 */}
      <div className="px-4 py-4">
        <p className="text-xs text-[#ADB0B5] mb-1">
          {card.art_type === 'MONTHLY'
            ? `${Number(card.created_month.split('-')[1])}월 이달의 아트`
            : '이벤트 아트'}
        </p>
        <p className="text-lg font-bold text-[#171B1C] mb-3">
          {card.min_price.toLocaleString()}~{card.max_price.toLocaleString()}원
        </p>
      </div>

      <RelatedArtList cards={relatedCards} />

      {/* 하단 고정 CTA */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 bg-white border-t border-[#E9EBEE] flex items-center gap-3 px-4 py-3">
        <ArtLikeBtn initialLiked={card.is_liked} />
        <button onClick={handleShare} aria-label="공유하기">
          <ShareIcon className="w-5 h-6 text-[#171B1C]" />
        </button>
        <button
          onClick={() => setShowKakaoModal(true)}
          className="flex-1 bg-[#171B1C] text-white rounded-lg py-3 text-sm font-bold flex items-center justify-center gap-2"
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
