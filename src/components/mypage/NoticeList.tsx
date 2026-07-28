import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightSmallIcon } from '../../assets/icons';
import { noticeList } from '../../data/mockupdata/noticeData';

export default function NoticeList() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedNotice = noticeList.find((notice) => notice.id === selectedId);

  if (selectedNotice) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative flex items-center justify-center px-4 py-4 border-b border-[#E9EBEE]">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="absolute left-4 cursor-pointer"
          >
            <ChevronLeftIcon className="w-5 h-5 text-[#171B1C]" />
          </button>
          <span className="text-base font-bold text-[#171B1C]">공지사항</span>
        </div>
        <div className="px-4 pt-4 pb-6">
          <p className="text-base font-bold text-[#171B1C]">
            {selectedNotice.title}
          </p>
          <p className="text-xs font-medium text-[#646F7C] mt-1">
            {selectedNotice.date}
          </p>
          <div className="border-t border-[#E9EBEE] mt-4 mb-5" />
          <p className="text-sm text-[#171B1C] whitespace-pre-line leading-relaxed">
            {selectedNotice.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex items-center justify-center px-4 py-4 border-b border-[#E9EBEE]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 cursor-pointer"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#171B1C]" />
        </button>
        <span className="text-base font-bold text-[#171B1C]">공지사항</span>
      </div>
      <div className="divide-y divide-[#E9EBEE]">
      {noticeList.map((notice) => (
        <button
          key={notice.id}
          type="button"
          onClick={() => setSelectedId(notice.id)}
          className="flex w-full items-center justify-between py-5 px-4 text-left"
        >
          <div>
            <p className="text-base font-semibold text-[#171B1C]">{notice.title}</p>
            <p className="text-xs font-normal text-[#646F7C] mt-1">
              {notice.date}
            </p>
          </div>
          <ChevronRightSmallIcon className="w-2 h-3 text-[#ADB0B5] shrink-0" />
        </button>
      ))}
      </div>
    </div>
  );
}
