//H102 아트 정보 입력 폼

import React, { useState, useEffect } from 'react';

type DesignTag = '심플' | '아기자기' | '화려' | '스트릿' | '유니크' | '내추럴' | '빈티지';
type ArtType = '이달의 아트' | '지난달 아트' | '이벤트' | '원컬러';

interface Art {
  id: number;
  shopName: string;
  artType: ArtType;
  priceMin: string;
  priceMax: string;
  tags: DesignTag[];
}

interface ArtFormProps {
  editingArt: Art | null;
  onAddArt: (art: Omit<Art, 'id'>) => void;
  onUpdateArt: (art: Art) => void;
}

export default function ArtForm({ editingArt, onAddArt, onUpdateArt }: ArtFormProps) {
  const [shopInput, setShopInput] = useState('');
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [instagramCode, setInstagramCode] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [registrationMonth, setRegistrationMonth] = useState('');
  const [selectedArtType, setSelectedArtType] = useState<ArtType>('이달의 아트');
  const [selectedTags, setSelectedTags] = useState<DesignTag[]>([]);
  const [showToast, setShowToast] = useState(false);

  const artTypes: ArtType[] = ['이달의 아트', '지난달 아트', '이벤트', '원컬러'];
  const allTags: DesignTag[] = ['심플', '아기자기', '화려', '스트릿', '유니크', '내추럴', '빈티지'];

  // 수정 모드 진입 시 데이터 바인딩
  useEffect(() => {
    if (editingArt) {
      setSelectedShop(editingArt.shopName);
      setShopInput(editingArt.shopName); // 입력창에도 같이 채워줌
      setSelectedArtType(editingArt.artType);
      setPriceMin(editingArt.priceMin);
      setPriceMax(editingArt.priceMax);
      setSelectedTags(editingArt.tags);
    } else {
      clearForm();
    }
  }, [editingArt]);

  const clearForm = () => {
    setShopInput('');
    setSelectedShop(null);
    setInstagramCode('');
    setPriceMin('');
    setPriceMax('');
    setRegistrationMonth('');
    setSelectedArtType('이달의 아트');
    setSelectedTags([]);
  };

  // 엔터를 쳤을 때도 뱃지 스타일을 유지하고 싶다면 동작하도록 놔둠
  const handleShopKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && shopInput.trim()) {
      e.preventDefault();
      setSelectedShop(shopInput.trim() === '미니' ? '미니숍네일' : shopInput.trim());
    }
  };

  const handleTagClick = (tag: DesignTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ⭐ [핵심 수정] 뱃지(selectedShop)가 선택 안 되어 있더라도, 입력창(shopInput)에 글자가 있으면 그것을 샵 이름으로 인정합니다!
    const finalShopName = selectedShop || shopInput.trim();
    if (!finalShopName) {
      alert("연결 샵 이름을 입력해주세요!");
      return;
    }

    if (editingArt) {
      onUpdateArt({
        ...editingArt,
        shopName: finalShopName,
        artType: selectedArtType,
        priceMin: priceMin || '40,000',
        priceMax: priceMax || '60,000',
        tags: selectedTags,
      });
    } else {
      onAddArt({
        shopName: finalShopName,
        artType: selectedArtType,
        priceMin: priceMin || '40,000',
        priceMax: priceMax || '60,000',
        tags: selectedTags,
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      clearForm();
    }
  };

  // ⭐ 입력창에 글자가 있거나 뱃지가 선택되어 있으면 버튼이 항상 활성화되도록 유연하게 검증 변경
  const isFormValid = selectedShop !== null || shopInput.trim() !== '';

  return (
    <section className="w-[400px] bg-white border border-[#E9ECEF] rounded-xs p-6 flex flex-col justify-between min-h-[680px]">
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-base font-bold text-black mb-1">
            {editingArt ? '아트 수정' : '아트 등록'}
          </h3>

          {/* 연결 샵 */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 block">연결 샵</label>
            {!selectedShop ? (
              <input
                type="text"
                value={shopInput}
                onChange={(e) => setShopInput(e.target.value)}
                onKeyDown={handleShopKeyDown}
                placeholder="샵명으로 검색 (ex: 미니 입력 후 Enter 가능)"
                className="w-full px-3 py-2 text-sm border border-[#E9ECEF] rounded-md focus:outline-none focus:border-gray-400 placeholder:text-gray-300"
              />
            ) : (
              /* 선택된 샵 뱃지 */
              <div className="flex flex-col items-start gap-1.5">
                <span className="text-[11px] text-gray-400 block">선택된 샵:</span>
                <div className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1.5 rounded-full font-medium">
                  {selectedShop}
                  <button type="button" onClick={() => { setSelectedShop(null); setShopInput(''); }} className="ml-1 text-gray-400 hover:text-white font-bold">×</button>
                </div>
              </div>
            )}
          </div>

          {/* 인스타그램 퍼가기 코드 */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 block">인스타그램 퍼가기 코드</label>
            <textarea
              rows={2}
              value={instagramCode}
              onChange={(e) => setInstagramCode(e.target.value)}
              placeholder="퍼가기 코드를 붙여넣으세요"
              className="w-full px-3 py-2 text-sm border border-[#E9ECEF] rounded-md focus:outline-none focus:border-gray-400 placeholder:text-gray-300 resize-none"
            />
          </div>

          {/* 가격 */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 block">가격</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="최소"
                className="w-full px-3 py-2 text-sm border border-[#E9ECEF] rounded-md text-center focus:outline-none focus:border-gray-400"
              />
              <span className="text-gray-300 text-sm">~</span>
              <input
                type="text"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="최대"
                className="w-full px-3 py-2 text-sm border border-[#E9ECEF] rounded-md text-center focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          {/* 등록 월 */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 block">등록 월</label>
            <input
              type="text"
              value={registrationMonth}
              onChange={(e) => setRegistrationMonth(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E9ECEF] rounded-md focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* 아트 유형 */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 block">아트유형</label>
            <div className="flex flex-wrap gap-1.5">
              {artTypes.map((type) => {
                const isSelected = selectedArtType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedArtType(type)}
                    className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-all ${
                      isSelected
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-600 border-[#E9ECEF] hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 디자인 태그 */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 block">디자인 태그</label>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                      isSelected
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-gray-600 border-[#E9ECEF]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 하단 제어부 */}
        <div className="mt-6 space-y-2.5">
          <button
            type="submit"
            className={`w-full py-3.5 rounded-md font-medium text-sm transition-colors ${
              isFormValid
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'bg-[#E9ECEF] text-gray-400 cursor-not-allowed'
            }`}
          >
            {editingArt ? '수정 저장하기' : '등록하기'}
          </button>

          {showToast && (
            <p className="text-xs text-[#2B8A3E] flex items-center gap-1 font-medium pl-1">
              ✓ 아트가 등록되었어요
            </p>
          )}
        </div>
      </form>
    </section>
  );
}