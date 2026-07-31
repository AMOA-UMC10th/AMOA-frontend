export interface DesignTag {
  designtagId: number;
  name: string;
}

interface DesignTagListResponse {
  designtags: DesignTag[];
}

interface ApiResponse<T> {
  code: string;
  message: string;
  isSuccess: boolean;
  result: T;
}

export async function fetchDesignTags(): Promise<DesignTag[]> {
  try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/shops/design-tags`);
    if (!res.ok) {
      console.error(`디자인 태그  실패: ${res.status}`);
      return [];
    }

    const data: ApiResponse<DesignTagListResponse> = await res.json();

    if (!data || !data.isSuccess) {
      console.error('디자인 태그 API 실패 응답:', data?.message);
      return [];
    }

    return data.result?.designtags ?? [];
  } catch (error) {
    console.error('fetchDesignTags 네트워크/파싱 에러:', error);
    return [];
  }
}
