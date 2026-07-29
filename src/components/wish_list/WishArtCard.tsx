// [E102] 찜한 아트 카드
// 설계서: 찜한 아트는 하트 활성 상태의 카드로 표시되고, 카드 탭 시 아트 상세로 이동한다.
// (이동과 찜 토글은 공통 ArtCard가 처리한다)

import ArtCard from '../common/ArtCard';
import type { LikedCard } from '../../data/likeList';

interface WishArtCardProps {
  card: LikedCard;
  onUnlike: (cardId: number) => void;
}

export default function WishArtCard({ card, onUnlike }: WishArtCardProps) {
  return (
    <ArtCard
      cardId={card.cardId}
      instagramUrl={card.instagramUrl}
      shopName={card.shopName}
      // 찜 목록 응답은 지역을 district로 내려준다.
      regionName={card.district}
      minPrice={card.minPrice}
      maxPrice={card.maxPrice}
      artType={card.artType}
      isLiked
      // 찜 API 호출과 토스트는 ArtCard(ArtLikeBtn)가 처리한다.
      // 여기서는 목록에서 빼는 일만 부모에게 알린다.
      onLikeChange={(liked) => {
        if (!liked) onUnlike(card.cardId);
      }}
    />
  );
}
