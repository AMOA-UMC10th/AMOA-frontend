// [E102] 찜한 아트 카드

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
      regionName={card.district}
      minPrice={card.minPrice}
      maxPrice={card.maxPrice}
      artType={card.artType}
      createdMonth={card.createdMonth}
      isLiked
      onLikeChange={(liked) => {
        if (!liked) onUnlike(card.cardId);
      }}
    />
  );
}
