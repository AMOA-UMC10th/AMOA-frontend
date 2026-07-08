//H102 아트 목록 관리 페이지 

import React, { useState } from 'react';
import { BiTrash, BiEditAlt } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import ArtForm from '../../components/admin/ArtForm';

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

export default function ArtManagePage() {
  const [arts, setArts] = useState<Art[]>([
    { id: 1, shopName: '미니숍네일', artType: '이달의 아트', priceMin: '40,000', priceMax: '70,000', tags: ['심플', '내추럴'] },
    { id: 2, shopName: '뷰티네일', artType: '이벤트', priceMin: '30,000', priceMax: '50,000', tags: ['화려', '아기자기'] },
  ]);

  const [editingArt, setEditingArt] = useState<Art | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [artIdToDelete, setArtIdToDelete] = useState<number | null>(null);

  const handleAddArt = (newArtData: Omit<Art, 'id'>) => {
    setArts([...arts, { id: Date.now(), ...newArtData }]);
  };

  const handleUpdateArt = (updatedArt: Art) => {
    setArts(arts.map((art) => (art.id === updatedArt.id ? updatedArt : art)));
    setEditingArt(null);
  };

  const openDeleteModal = (id: number) => {
    setArtIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (artIdToDelete !== null) {
      setArts(arts.filter((art) => art.id !== artIdToDelete));
      setIsDeleteModalOpen(false);
      setArtIdToDelete(null);
      if (editingArt?.id === artIdToDelete) setEditingArt(null);
    }
  };

  return (
    <>
      
      {/* 왼쪽 서브 폼 컴포넌트 */}
      <ArtForm
        editingArt={editingArt}
        onAddArt={handleAddArt}
        onUpdateArt={handleUpdateArt}
      />

      {/* 오른쪽 목록 콘텐츠 리스트 */}
      <section className="flex-1 bg-white border border-[#E9ECEF] rounded-xs p-6 flex flex-col min-h-[600px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-black">등록된 아트 {arts.length}개</h3>
          <div className="relative w-72">
            <input
              type="text"
              placeholder="샵 이름 검색"
              className="w-full pl-3 pr-10 py-2 text-sm border border-[#E9ECEF] rounded-md focus:outline-none focus:border-gray-400 placeholder:text-gray-300"
            />
            <FiSearch className="absolute right-3 top-2.5 text-gray-300 w-4 h-4" />
          </div>
        </div>

        {/* 리스트 헤더 그리드 */}
        <div className="grid grid-cols-[1.5fr_1.5fr_2fr_2fr_0.5fr] px-4 py-2 text-xs font-semibold text-gray-400 border-b border-[#F1F3F5] mb-2">
          <div>연결 샵</div>
          <div>유형</div>
          <div>가격</div>
          <div>디자인 태그</div>
          <div></div>
        </div>

        {/* 스크롤 본문 열 */}
        <div className="space-y-2 overflow-y-auto flex-1">
          {arts.map((art) => {
            const isCurrentEditing = editingArt?.id === art.id;
            return (
              <div
                key={art.id}
                className={`grid grid-cols-[1.5fr_1.5fr_2fr_2fr_0.5fr] items-center px-4 py-4 bg-white border rounded-lg transition-all ${
                  isCurrentEditing ? 'border-neutral-400 bg-neutral-50 shadow-sm' : 'border-[#F1F3F5] hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-bold text-black">{art.shopName}</div>
                <div>
                  <span className="px-2 py-0.5 text-[11px] bg-[#F1F3F5] text-gray-600 rounded-sm font-medium">
                    {art.artType}
                  </span>
                </div>
                <div className="text-sm text-gray-600 font-mono">
                  {art.priceMin}~{art.priceMax}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {art.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-[11px] bg-white text-gray-500 border border-[#E9ECEF] rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end gap-3 text-gray-400">
                  <button onClick={() => setEditingArt(art)} className="hover:text-gray-600">
                    <BiEditAlt className="w-4 h-4" />
                  </button>
                  <button onClick={() => openDeleteModal(art.id)} className="hover:text-red-500">
                    <BiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* App-5번: 독립형 아트 삭제 컴펌 오버레이 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[400px] shadow-2xl text-center space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-black">이 아트를 삭제하시겠어요?</h4>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 border border-[#E9ECEF] text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-black text-white rounded-xl font-medium text-sm hover:bg-neutral-800"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}