import React, { useEffect, useState } from 'react';
import { fetchDesignTags, type DesignTag } from '../../data/designTag';

interface DesignFilterProps {
  selectedDesigns: number[];
  onToggleDesign: (designTagId: number) => void;
}

export default function DesignFilter({
  selectedDesigns = [],
  onToggleDesign,
}: DesignFilterProps) {
  const [designTags, setDesignTags] = useState<DesignTag[]>([]);
  const isAllSelected = selectedDesigns.length === 0;

  useEffect(() => {
    let isMounted = true;

    fetchDesignTags()
      .then((tags) => {
        if (isMounted) {
          setDesignTags(Array.isArray(tags) ? tags : []);
        }
      })
      .catch((err) => {
        console.error('디자인 태그 목록 로드 실패:', err);
        if (isMounted) {
          setDesignTags([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="py-2">
      <h3 className="text-sm font-bold text-[#1d2026] mb-3.5">디자인</h3>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            if (!isAllSelected) {
              selectedDesigns.forEach((id) => onToggleDesign(id));
            }
          }}
          className={`flex h-8 items-center justify-center rounded-full border px-3 text-xs transition-all ${
            isAllSelected
              ? 'border-[#FF007A] bg-[#FF007A] text-white'
              : 'border-[#ced4da] bg-white text-[#495057] hover:bg-gray-50'
          }`}
        >
          전체
        </button>

        {(designTags || []).map((tag) => {
          if (!tag) return null;
          const isSelected = selectedDesigns.includes(tag.designTagId);
          return (
            <button
              key={tag.designTagId}
              type="button"
              onClick={() => onToggleDesign(tag.designTagId)}
              className={`flex h-8 items-center justify-center rounded-full border px-3 text-xs transition-all ${
                isSelected
                  ? 'border-[#FF007A] bg-[#FF007A] text-white'
                  : 'border-[#ced4da] bg-white text-[#56606d] hover:bg-gray-50'
              }`}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}