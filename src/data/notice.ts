// ===== 타입 =====

export interface NoticeListItem {
  noticeId: number;
  title: string;
  createdAt: string;
}

export interface NoticeDetail {
  noticeId: number;
  title: string;
  content: string;
  createdAt: string;
}

interface NoticeApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// ===== API 호출 =====

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/notices`;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

export async function fetchNoticeList(): Promise<NoticeListItem[]> {
  const res = await fetch(BASE_URL, { headers: authHeaders() });

  if (!res.ok) {
    throw new Error(`공지사항 목록 조회 실패: ${res.status}`);
  }

  const data: NoticeApiResponse<NoticeListItem[]> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
}

export async function fetchNoticeDetail(noticeId: number): Promise<NoticeDetail> {
  const res = await fetch(`${BASE_URL}/${noticeId}`, { headers: authHeaders() });

  if (!res.ok) {
    throw new Error(`공지사항 상세 조회 실패: ${res.status}`);
  }

  const data: NoticeApiResponse<NoticeDetail> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
}
