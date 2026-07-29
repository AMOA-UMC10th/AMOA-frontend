import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstagramSafeImage from './InstagramSafeImage';
import { AddressPinIcon } from '../../assets/icons';
import ArtLikeBtn from './ArtLikeBtn';

interface CommonArtCardProps {
  cardId: number;
  instagramUrl: string;
  shopName: string;
  regionName: string;
  minPrice: number;
  maxPrice: number;
  artType: string;
  isLiked?: boolean;
  // 찜 상태가 바뀐 뒤 호출된다. 찜 목록처럼 해제 시 항목을 빼야 하는 화면에서 쓴다.
  onLikeChange?: (liked: boolean) => void;
}

export default function ArtCard({
  cardId,
  instagramUrl,
  shopName,
  regionName,
  minPrice,
  maxPrice,
  artType,
  isLiked = false,
  onLikeChange,
}: CommonArtCardProps) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(isLiked);

  const artMonth = new Date().getMonth() + 1;

  const handleTextClick = () => {
    navigate(`/art-detail/${cardId}`);
  };

  const getArtTypeLabel = (type: string) => {
    switch (type) {
      case 'MONTHLY':
        return '이달아';
      case 'EVENT':
        return '이벤트';
      default:
        return '아트';
    }
  };

  return (
    <div className="w-full group">
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <InstagramSafeImage url={instagramUrl} />
      </div>

      <div className="mt-2.5 px-2 cursor-pointer" onClick={handleTextClick}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] bg-[#FFF0F6] text-[#374553] px-1.5 py-0.5 rounded font-bold">
            {artMonth}월 {getArtTypeLabel(artType)}
          </span>
          <div onClick={(e) => e.stopPropagation()} className="mr-1.5">
            {/* cardId를 넘겨야 ArtLikeBtn이 실제 찜 API를 호출한다. */}
            <ArtLikeBtn
              initialLiked={liked}
              cardId={cardId}
              size={16}
              onToggle={(nextLiked) => {
                setLiked(nextLiked);
                onLikeChange?.(nextLiked);
              }}
            />
          </div>
        </div>

        <p className="text-sm font-bold text-[#28323C] group-hover:text-[#FF007A] transition-colors truncate mt-1">
          {shopName || '이름 없음'}
        </p>

        <p className="text-xs text-[#ADB0B5] flex items-center gap-0.5 mt-0.5">
          <AddressPinIcon className="w-3.5 h-3.5 text-[#ADB0B5]" />
          {regionName || '지역 정보 없음'}
        </p>

        <p className="text-xs text-[#646F7C] mt-1 font-semibold">
          {minPrice ? `${minPrice.toLocaleString()}원` : '0원'} ~{' '}
          {maxPrice ? `${maxPrice.toLocaleString()}원` : '0원'}
        </p>
      </div>
    </div>
  );
}