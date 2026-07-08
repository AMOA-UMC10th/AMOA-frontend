//H101 샵 정보 입력 폼

import React, { useState, useEffect } from 'react';

type MoodTag = '심플' | '아기자기' | '화려' | '스트릿' | '유니크' | '내추럴' | '빈티지';

interface Shop {
  id: number;
  name: string;
  location: string;
  tags: MoodTag[];
  phone?: string;
  hours?: string;
}

interface ShopFormProps {
  editingShop: Shop | null;
  onAddShop: (shop: Omit<Shop, 'id'>) => void;
  onUpdateShop: (shop: Shop) => void;
}

export default function ShopForm({ editingShop, onAddShop, onUpdateShop }: ShopFormProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState('');
  const [selectedTags, setSelectedTags] = useState<MoodTag[]>([]);
  const [showToast, setShowToast] = useState(false);

  const allTags: MoodTag[] = ['심플', '아기자기', '화려', '스트릿', '유니크', '내추럴', '빈티지'];

  // 리스트에서 수정 아이콘을 누르면 기존 데이터를 폼에 채워넣음
  useEffect(() => {
    if (editingShop) {
      setName(editingShop.name);
      setLocation(editingShop.location);
      setPhone(editingShop.phone || '010-1234-5678');
      setHours(editingShop.hours || '월~금 10:00~20:00');
      setSelectedTags(editingShop.tags);
    } else {
      clearForm();
    }
  }, [editingShop]);

  const clearForm = () => {
    setName('');
    setLocation('');
    setPhone('');
    setHours('');
    setSelectedTags([]);
  };

  const handleTagClick = (tag: MoodTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingShop) {
      onUpdateShop({
        ...editingShop,
        name,
        location: location || '성동구 성수동 123',
        tags: selectedTags,
        phone,
        hours,
      });
    } else {
      onAddShop({
        name,
        location: location || '성동구 성수동 123',
        tags: selectedTags,
        phone: phone || '010-1234-5678',
        hours: hours || '월~금 10:00~20:00',
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // 3초 후 토스트 사라짐
      clearForm();
    }
  };

  // 모든 인풋이 입력되었는지 확인 (피그마 검정 버튼 활성화용)
  const isFormValid = name.length > 0;

  return (
    <section className="w-[300px] bg-white border-r border-[#E9ECEF] px-5 pt-6 pb-8 flex flex-col justify-between min-h-full shrink-0">
      <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          <h3 className="text-base font-bold text-black mb-2">
            {editingShop ? '샵 수정' : '샵 등록'}
          </h3>
          
          {/* 샵명 */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 block">샵명</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="샵 이름 입력" 
                className="flex-1 min-w-0 px-3 py-2 text-sm border border-[#E9ECEF] rounded-md focus:outline-none focus:border-gray-400 placeholder:text-gray-300"
              />
              <button 
                type="button"
                onClick={() => { setName('미니숍네일'); setLocation('성동구 성수동 123'); }}
                className={`px-3 py-2 text-xs rounded-md font-medium whitespace-nowrap transition-colors ${name ? 'bg-black text-white' : 'bg-[#E9ECEF] text-gray-600'}`}
              >
                자동완성
              </button>
            </div>
          </div>

          {/* 위치 */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 block">위치</label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="카카오 로컬 API 자동완성" 
              className="w-full px-3 py-2 text-sm bg-[#EBEBEB] rounded-lg placeholder:text-gray-400" 
            />
          </div>

          {/* 전화번호 */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 block">전화번호</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="카카오 로컬 API 자동완성" 
              className="w-full px-3 py-2 text-sm bg-[#EBEBEB] rounded-lg placeholder:text-gray-400" 
            />
          </div>

          {/* 운영시간 */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 block">운영시간</label>
            <input 
              type="text" 
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="카카오 로컬 API 자동완성" 
              className="w-full px-3 py-2 text-sm bg-[#EBEBEB] rounded-lg placeholder:text-gray-400" 
            />
          </div>

          {/* 무드 태그 */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 block">무드 태그</label>
            <div className="flex flex-wrap gap-2">
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
                        : 'bg-white text-gray-600 border-[#E9ECEF] hover:border-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 하단 버튼 및 토스트 영역 */}
        <div className="mt-8 space-y-3">
          <button 
            type="submit"
            className={`w-full py-3.5 rounded-md font-medium text-sm transition-colors ${
              isFormValid 
                ? 'bg-black text-white hover:bg-neutral-800' 
                : 'bg-[#E9ECEF] text-gray-400 cursor-not-allowed'
            }`}
          >
            {editingShop ? '수정 저장하기' : '등록하기'}
          </button>

          {/* ✓ 샵이 등록되었어요 문구 (피그마 3번 반영) */}
          {showToast && (
            <p className="text-xs text-[#2B8A3E] flex items-center gap-1 font-medium animate-fade-in pl-1">
              ✓ 샵이 등록되었어요
            </p>
          )}
        </div>
      </form>
    </section>
  );
}