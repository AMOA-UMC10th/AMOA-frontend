export interface TermListItem {
  termId: number;
  title: string;
  required: boolean;
}

export interface TermDetail {
  termId: number;
  title: string;
  content: string;
  createdAt: string;
}

interface TermApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/terms`;

export async function fetchTermList(): Promise<TermListItem[]> {
  const res = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`이용약관 목록 조회 실패: ${res.status}`);
  }

  const data = (await res.json()) as TermApiResponse<TermListItem[]>;

  if (!data.isSuccess) {
    throw new Error(data.message || '약관 정보를 불러오지 못했습니다.');
  }

  return data.result;
}

export async function fetchTermDetail(termId: number): Promise<TermDetail> {
  const res = await fetch(`${BASE_URL}/${termId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`이용약관 상세 조회 실패: ${res.status}`);
  }

  const data: TermApiResponse<TermDetail> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
}