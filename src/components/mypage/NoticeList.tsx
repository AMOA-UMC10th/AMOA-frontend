import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightSmallIcon } from '../../assets/icons';
import {
  fetchNoticeDetail,
  fetchNoticeList,
  type NoticeDetail,
  type NoticeListItem,
} from '../../data/notice';

function formatDate(dateTime: string) {
  return dateTime.slice(0, 10).replace(/-/g, '.');
}

export default function NoticeList() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<NoticeListItem[]>([]);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    fetchNoticeList()
      .then(setNotices)
      .catch((err) => {
        console.error(err);
        setListError('공지사항을 불러오지 못했어요');
      });
  }, []);

  useEffect(() => {
    if (selectedId === null) {
      setSelectedNotice(null);
      return;
    }

    setDetailError(null);
    fetchNoticeDetail(selectedId)
      .then(setSelectedNotice)
      .catch((err) => {
        console.error(err);
        setDetailError('공지사항을 불러오지 못했어요');
      });
  }, [selectedId]);

  if (selectedId !== null) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative flex items-center justify-center px-4 py-2.5 border-b border-[#E9EBEE]">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="absolute left-4 cursor-pointer"
          >
            <ChevronLeftIcon className="w-5 h-5 text-[#171B1C]" />
          </button>
          <span className="text-base font-bold text-[#171B1C]">공지사항</span>
        </div>
        {detailError && (
          <p className="px-4 pt-6 text-sm text-[#F70071]">{detailError}</p>
        )}
        {selectedNotice && (
          <div className="px-4 pt-4 pb-6">
            <p className="text-base font-bold text-[#171B1C]">
              {selectedNotice.title}
            </p>
            <p className="text-xs font-medium text-[#646F7C] mt-1">
              {formatDate(selectedNotice.createdAt)}
            </p>
            <div className="border-t border-[#E9EBEE] mt-4 mb-5" />
            <p className="text-sm text-[#171B1C] whitespace-pre-line leading-relaxed">
              {selectedNotice.content}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex items-center justify-center px-4 py-2.5 border-b border-[#E9EBEE]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 cursor-pointer"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#171B1C]" />
        </button>
        <span className="text-base font-bold text-[#171B1C]">공지사항</span>
      </div>
      {listError && (
        <p className="px-4 pt-6 text-sm text-[#F70071]">{listError}</p>
      )}
      <div className="divide-y divide-[#E9EBEE]">
        {notices.map((notice) => (
          <button
            key={notice.noticeId}
            type="button"
            onClick={() => setSelectedId(notice.noticeId)}
            className="flex w-full items-center justify-between py-5 px-4 text-left"
          >
            <div>
              <p className="text-base font-semibold text-[#171B1C]">{notice.title}</p>
              <p className="text-xs font-normal text-[#646F7C] mt-1">
                {formatDate(notice.createdAt)}
              </p>
            </div>
            <ChevronRightSmallIcon className="w-2 h-3 text-[#ADB0B5] shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
