//아트 상세 페이지 (C101)

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import InstagramEmbed from '../components/art_detail/InstagramEmbed';
import ArtLikeBtn from '../components/common/ArtLikeBtn';
import RelatedArtList from '../components/art_detail/RelatedArtList';
import KakaoMoveModal from '../components/art_detail/KakaoMoveModal';
import {
  ChevronLeftIcon,
  AddressPinIcon,
  ShareIcon,
} from '../assets/icons';
import {
  fetchCardDetail,
  fetchRecommendedCards,
  type CardDetail,
  type RecommendedCard,
} from '../data/card';

export default function ArtDetailPage() {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const [showKakaoModal, setShowKakaoModal] = useState(false);
  const [card, setCard] = useState<CardDetail | null>(null);
  const [relatedCards, setRelatedCards] = useState<RecommendedCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) return;
    let cancelled = false;

    fetchCardDetail(Number(cardId))
      .then((data) => {
        if (!cancelled) setCard(data);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError('아트 정보를 불러오지 못했어요');
      });

    fetchRecommendedCards(Number(cardId))
      .then((data) => {
        if (!cancelled) setRelatedCards(data);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      cancelled = true;
    };
  }, [cardId]);

  const handleShopClick = () => {
    if (!card) return;
    navigate(`/shop/${card.shopId}`);
  };

  const handleReservationClick = () => {
    if (!card) return;
    navigate(`/reservation/${card.cardId}`);
  };

  const handleShare = () => {
    if (!card) return;
    if (navigator.share) {
      navigator
        .share({
          title: card.shopName,
          url: window.location.href,
        })
        .catch(() => {});
    }
  };

  if (error) {
    return (
      <div className="w-full pb-24 px-4 pt-6">
        <p className="text-sm text-[#F70071]">{error}</p>
      </div>
    );
  }

  if (!card) {
    return <div className="w-full pb-24" />;
  }

  return (
    <div className="w-full pb-24">
      <div className="relative flex items-center justify-center px-4 py-3">
        <button onClick={() => navigate(-1)} className="absolute left-4">
          <ChevronLeftIcon className="w-5 h-5 text-[#171B1C]" />
        </button>
        <span className="text-sm font-bold">아트 상세</span>
      </div>

      <div className="px-1">
        <InstagramEmbed postUrl={card.instagramUrl} />
      </div>

      <button
        onClick={handleShopClick}
        className="flex items-center gap-2 px-4 py-4 w-full"
      >
        <span className="w-9 h-9 rounded-full bg-[#E9EBEE] shrink-0" />
        <div className="text-left">
          <p className="text-sm font-bold text-[#171B1C]">{card.shopName}</p>
          <p className="text-xs text-[#ADB0B5] flex items-center gap-0.5">
            <AddressPinIcon className="w-3 h-3 text-[#ADB0B5]" />
            {card.address}
          </p>
        </div>
      </button>

      <div className="border-t border-[#E9EBEE] mx-4 mb-4" />

      <div className="px-4 py-1">
        <p className="text-xs text-[#646F7C] font-bold mb-1">
          {card.artType === 'MONTHLY'
            ? `${Number(card.createdMonth.split('-')[1])}월 이달의 아트`
            : '이벤트 아트'}
        </p>
        <p className="text-lg font-bold text-[#171B1C] mb-3">
          {card.minPrice.toLocaleString()}~{card.maxPrice.toLocaleString()}원
        </p>

        {card.designTags.length > 0 && (
          <div className="py-1">
            <p className="text-xs text-[#646F7C] font-bold mb-2">디자인 태그</p>
            <div className="flex flex-wrap gap-2">
              {card.designTags.map((tag) => (
                <span
                  key={tag.designTagId}
                  className="text-xs text-[#F70071] bg-[#FFEEF6] px-3 py-1.5 rounded-full font-semibold"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <RelatedArtList cards={relatedCards} />

      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 bg-white border-t border-[#E9EBEE] flex items-center gap-9 px-4 py-3">
        <ArtLikeBtn initialLiked={false} cardId={card.cardId} size={24} />
        <button
          onClick={handleShare}
          aria-label="공유하기"
          className="flex items-center justify-center"
        >
          <ShareIcon className="w-5 h-6 text-[#171B1C] block" />
        </button>
        <button
          onClick={handleReservationClick}
          className="w-[70%] bg-[#171B1C] text-white rounded-lg py-3 text-sm font-bold flex items-center justify-center gap-2 shrink-0"
        >
          예약하기
        </button>
      </div>

      <KakaoMoveModal
        isOpen={showKakaoModal}
        onClose={() => setShowKakaoModal(false)}
        shopName={card.shopName}
      />
    </div>
  );
}
