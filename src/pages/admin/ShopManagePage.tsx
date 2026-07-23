import { useState } from 'react';
import { BiTrash, BiEditAlt } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import ShopForm from '../../components/admin/ShopForm';
import { initialShops, type Shop } from '../../data/adminData';

export default function ShopManagePage() {
  const [shops, setShops] = useState<Shop[]>(initialShops);

  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [shopIdToDelete, setShopIdToDelete] = useState<number | null>(null);

  const handleAddShop = (newShopData: Omit<Shop, 'id'>) => {
    setShops([...shops, { id: Date.now(), ...newShopData }]);
  };

  const handleUpdateShop = (updatedShop: Shop) => {
    setShops(shops.map(shop => shop.id === updatedShop.id ? updatedShop : shop));
    setEditingShop(null);
  };

  const openDeleteModal = (id: number) => {
    setShopIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (shopIdToDelete !== null) {
      setShops(shops.filter(shop => shop.id !== shopIdToDelete));
      setIsDeleteModalOpen(false);
      setShopIdToDelete(null);
      if (editingShop?.id === shopIdToDelete) setEditingShop(null);
    }
  };

  return (
    <>
      
      <ShopForm 
        editingShop={editingShop} 
        onAddShop={handleAddShop} 
        onUpdateShop={handleUpdateShop} 
      />

      <section className="flex-1 bg-[#F7F7F7] flex flex-col min-h-full">
        <div className="flex justify-between items-center bg-white px-6 py-5 border-[#E9ECEF]">
          <h3 className="text-base font-bold text-black">등록된 샵 {shops.length}개</h3>
          <div className="relative w-72">
            <input type="text" placeholder="샵 이름, 위치 검색" className="w-full pl-3 pr-10 py-2 text-sm border border-[#E9ECEF] rounded-md focus:outline-none focus:border-gray-400 placeholder:text-gray-300" />
            <FiSearch className="absolute right-3 top-2.5 text-gray-300 w-4 h-4" />
          </div>
        </div>

        <div className='px-6'>
          <div className="grid grid-cols-[1.5fr_2fr_2fr_0.5fr] px-10 py-3 text-xs font-semibold text-gray-400">
          <div>샵명</div>
          <div>위치</div>
          <div>무드태그</div>
          <div></div>
        </div>

        <div className="overflow-y-auto flex-1">
          {shops.map((shop) => (
          <div key={shop.id} className={`grid grid-cols-[1.5fr_2fr_2fr_0.5fr] items-center px-10 py-4 border-b border-[#E9ECEF] transition-all ${editingShop?.id === shop.id ? 'bg-[#EEF6FF]' : 'bg-white hover:bg-[#FAFAFA]'}`}>
              <div className="text-sm font-bold text-black">{shop.name}</div>
              <div className="text-sm text-gray-600">{shop.location}</div>
              <div className="flex gap-1.5 flex-wrap">
                {shop.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 text-[11px] bg-white text-gray-500 border border-[#E9ECEF] rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex justify-end gap-3 text-gray-400">
                <button onClick={() => setEditingShop(shop)} className="hover:text-gray-600"><BiEditAlt className="w-4 h-4" /></button>
                <button onClick={() => openDeleteModal(shop.id)} className="hover:text-red-500"><BiTrash className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </section>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[400px] shadow-2xl border text-center space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-black">샵을 삭제하시겠어요?</h4>
              <p className="text-sm text-[#AAAAAA]">이 샵에 등록된 아트 3개가 함께 삭제돼요.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 border border-[#E9ECEF] text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50">취소</button>
              <button onClick={confirmDelete} className="flex-1 bg-black text-white rounded-xl font-medium text-sm hover:bg-neutral-800">삭제</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}