import ArtCard from '../common/ArtCard';
import type { NailCard } from '../../data/mockupdata/nailData';

interface WishArtCardProps {
  card: NailCard;
  onUnlike: (cardId: number) => void;
}

export default function WishArtCard({ card }: WishArtCardProps) {
  return (
    <ArtCard
      cardId={card.card_id}
      instagramUrl={card.instagram_url}
      shopName={card.shop_name}
      regionName={card.region_name}
      minPrice={card.min_price}
      maxPrice={card.max_price}
      artType={card.art_type}
      isLiked={true}
    />
  );
}