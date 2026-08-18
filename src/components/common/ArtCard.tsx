import { useNavigate } from 'react-router-dom';
import InstagramSafeImage from './InstagramSafeImage';
import { AddressPinIcon } from '../../assets/icons';
import ArtLikeBtn from './ArtLikeBtn';
import { useCardLiked } from '../../data/likeStore';

interface CommonArtCardProps {
  cardId?: number;
  instagramUrl?: string;
  shopName?: string;
  regionName?: string;
  minPrice?: number;
  maxPrice?: number;
  artType?: string;
  isLiked?: boolean;
  createdMonth?: string;
  isLoading?: boolean;
  onLikeChange?: (liked: boolean) => void;
}

// 이미지 시안에 맞춘 스켈레톤 UI 컴포넌트
export function ArtCardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* 카드 상단: 프로필 & 우측 뱃지 스켈레톤 */}
      <div className="flex items-center justify-between py-2 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-gray-200 rounded-full" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
        <div className="h-3.5 w-12 bg-[#E2E0FF] rounded" />
      </div>

      {/* 메인 이미지 스켈레톤 */}
      <div className="w-full aspect-[18/25] bg-gray-200" />

      {/* 카드 하단 정보 스켈레톤 */}
      <div className="mt-2.5 px-2 space-y-2">
        <div className="flex items-center justify-between">
          {/* 연분홍 뱃지 */}
          <div className="h-4 w-14 bg-[#FFF0F6] rounded" />
          {/* 하트 아이콘 위치 */}
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
        </div>

        {/* 샵 이름 / 지역 / 가격 */}
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-3.5 w-1/2 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function ArtCard({
  cardId,
  instagramUrl,
  shopName,
  regionName,
  minPrice,
  maxPrice,
  artType,
  createdMonth,
  isLiked = false,
  isLoading = false,
  onLikeChange,
}: CommonArtCardProps) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(isLiked);

  if (isLoading) {
    return <ArtCardSkeleton />;
  }

  const getDisplayMonth = () => {
    if (createdMonth) {
      const parts = createdMonth.split('-');
      if (parts.length >= 2) {
        return parseInt(parts[1], 10);
      }
    }
    return new Date().getMonth() + 1;
  };
  const artMonth = getDisplayMonth();

  const handleCardClick = () => {
    if (cardId) navigate(`/art-detail/${cardId}`);
  };

  const getArtTypeLabel = (type?: string, month?: string) => {
    if (type === 'EVENT') return '이벤트';
    if (type === 'MONTHLY') return '이달아';

    if (month) {
      const currentYearMonth = `${new Date().getFullYear()}-${String(
        new Date().getMonth() + 1
      ).padStart(2, '0')}`;
      return month === currentYearMonth ? '이달아' : '이달아';
    }

    return '아트';
  };

  return (
    <div className="w-full group">
      <div
        className="relative w-full aspect-[18/25] overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        <InstagramSafeImage url={instagramUrl || ''} />
      </div>

      <div className="mt-2.5 px-2 cursor-pointer" onClick={handleCardClick}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] bg-[#FFF0F6] text-[#374553] px-1.5 py-0.5 rounded font-semibold">
            {artMonth}월 {getArtTypeLabel(artType, createdMonth)}
          </span>
          <div onClick={(e) => e.stopPropagation()} className="mr-1.5 translate-y-1">
            {cardId && (
              <ArtLikeBtn
                initialLiked={liked}
                cardId={cardId}
                size={20}
                onToggle={(nextLiked) => {
                  setLiked(nextLiked);
                  onLikeChange?.(nextLiked);
                }}
              />
            )}
          </div>
        </div>

        <p className="text-[16px] font-bold text-[#28323C] group-hover:text-[#FF007A] transition-colors truncate mt-0.5 -my-0.5">
          {shopName || '이름 없음'}
        </p>

        <p className="text-[#ADB0B5] flex text-sm items-center gap-0.5 -mt-0.2">
          <AddressPinIcon className="w-4 h-4 text-[#D4D7DC]" />
          {regionName || '지역 정보 없음'}
        </p>

        <p className="text-[13px] text-[#646F7C] font-semibold -mt-0.2">
          {minPrice ? `${minPrice.toLocaleString()}원` : '0원'} ~{' '}
          {maxPrice ? `${maxPrice.toLocaleString()}원` : '0원'}
        </p>
      </div>
    </div>
  );
}
