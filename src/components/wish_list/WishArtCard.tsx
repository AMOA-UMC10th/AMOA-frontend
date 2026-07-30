// [E102] 찜한 아트 카드

import ArtCard from '../common/ArtCard';
import type { LikedCard } from '../../data/likeList';

interface WishArtCardProps {
  card: LikedCard;
  // 하트를 끄면 목록에서 바로 빼기 위해 알려준다. (요청 자체는 ArtCard 안에서 보낸다)
  onUnlike: (cardId: number) => void;
}

export default function WishArtCard({ card, onUnlike }: WishArtCardProps) {
  return (
    <ArtCard
      cardId={card.cardId}
      instagramUrl={card.instagramUrl}
      shopName={card.shopName}
      regionName={card.district}
      minPrice={card.minPrice}
      maxPrice={card.maxPrice}
      artType={card.artType}
      isLiked
      onLikeChange={(liked) => {
        if (!liked) onUnlike(card.cardId);
      }}
    />
  );
}
