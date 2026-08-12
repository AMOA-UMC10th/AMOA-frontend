//H102 아트 목록 관리 페이지 

import React, { useState } from 'react';
import { BiTrash, BiEditAlt } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import ArtForm from '../../components/admin/ArtForm';
import { initialArts, type Art } from '../../data/mockupdata/adminData';

export default function ArtManagePage() {
  const [arts, setArts] = useState<Art[]>(initialArts);

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
      <section className="flex-1 bg-[#F7F7F7] flex flex-col min-h-full">
          <div className="flex justify-between items-center bg-white px-6 py-5">
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
        <div className="grid grid-cols-[1.5fr_1.5fr_2fr_2fr_0.5fr] px-10 py-3 text-xs font-semibold text-gray-400">
          <div>연결 샵</div>
          <div>유형</div>
          <div>가격</div>
          <div>디자인 태그</div>
          <div></div>
        </div>

        {/* 스크롤 본문 열 */}
        <div className="overflow-y-auto flex-1 px-6">
          {arts.map((art) => {
            const isCurrentEditing = editingArt?.id === art.id;
            return (
              <div
                key={art.id}
                className={`grid grid-cols-[1.5fr_1.5fr_2fr_2fr_0.5fr] items-center px-10 py-4 border-b border-[#E9ECEF] transition-all ${
                  isCurrentEditing ? 'bg-[#EEF6FF]' : 'bg-white hover:bg-[#EFF6FF]'
                }`}
              >
                <div className="text-sm font-bold text-black">{art.shopName}</div>
                <div>
                  <span className="px-2 py-0.5 text-[11px] bg-[#F1F3F5] text-gray-600 rounded-full font-medium">
                    {art.artType}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
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