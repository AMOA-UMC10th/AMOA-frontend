import React, { useState } from 'react';
import { BiStore, BiImages, BiCheckSquare, BiTrash } from 'react-icons/bi';
import ShopManagePage from '../../pages/admin/ShopManagePage'; 
import ArtManagePage from '../../pages/admin/ArtManagePage';   

type TabType = 'shop' | 'art' | 'apply' | 'delete';

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState<TabType>('shop');

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'shop': return '샵 등록';
      case 'art': return '아트 등록';
      case 'apply': return '입점 신청';
      case 'delete': return '삭제 요청';
      default: return '어드민';
    }
  };

  const getMenuClass = (tab: TabType) => {
    const baseClass = "flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ";
    if (activeTab === tab) {
      return baseClass + "bg-[#111111] text-white font-semibold shadow-sm";
    }
    return baseClass + "text-gray-500 hover:bg-gray-50 hover:text-gray-900";
  };

  return (
<div className="flex min-h-screen bg-[#F7F7F7] text-[#333333] font-sans">
     
      <aside className="w-40 bg-white border-r border-[#E9ECEF] flex flex-col shrink-0">
        <div className="px-5 pt-7 pb-8">
          <h1 className="text-base font-bold tracking-wider text-black">AMOA.</h1>
          <p className="text-xs text-gray-400 mt-1">어드민</p>
        </div>
        <nav className="p-3 space-y-3">
          <button type="button" onClick={() => setActiveTab('shop')} className={getMenuClass('shop')}>
            <BiStore className="font-pretendard w-5 h-5 mr-3" /> 샵 등록
          </button>
          <button type="button" onClick={() => setActiveTab('art')} className={getMenuClass('art')}>
            <BiImages className="font-pretendard w-5 h-5 mr-3" /> 아트 등록
          </button>
          <button type="button" onClick={() => setActiveTab('apply')} className={getMenuClass('apply')}>
            <BiCheckSquare className="font-pretendard w-5 h-5 mr-3" /> 입점 신청
          </button>
          <button type="button" onClick={() => setActiveTab('delete')} className={getMenuClass('delete')}>
            <BiTrash className="font-pretendard w-5 h-5 mr-3" /> 삭제 요청
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        
        <header className="h-14 bg-white border-b border-[#E9ECEF] flex items-center px-8 shrink-0">
          <h2 className="text-base font-bold text-black">{getHeaderTitle()}</h2>
        </header>

            <main className="flex-1 flex flex-row items-stretch overflow-hidden">
              {activeTab === 'shop' && <ShopManagePage />}
              {activeTab === 'art' && <ArtManagePage />}
              
              {(activeTab === 'apply' || activeTab === 'delete') && (
                <div className="bg-white text-center w-full flex flex-col justify-center items-center ">
                  <p className="text-gray-400 text-sm font-medium">해당 화면은 준비 중입니다.</p>
                </div>
              )}
            </main>
      </div>

    </div>
  );
}