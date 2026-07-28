// A102/F104 디자인 무드 카드 이미지 매핑 (피그마 설계서에서 추출한 에셋)

import moodPure from '../../assets/moods/mood-pure.png';
import moodChic from '../../assets/moods/mood-chic.png';
import moodNatural from '../../assets/moods/mood-natural.png';
import moodCute from '../../assets/moods/mood-cute.png';
import moodFancy from '../../assets/moods/mood-fancy.png';
import moodStreet from '../../assets/moods/mood-street.png';
import moodUnique from '../../assets/moods/mood-unique.png';

// key는 백엔드 design-moods 이름의 접두어 기준 (예: "청순/미니멀"도 "청순"으로 매칭)
const MOOD_IMAGE_MAP: Record<string, string> = {
  청순: moodPure,
  심플: moodPure,
  시크: moodChic,
  내추럴: moodNatural,
  아기자기: moodCute,
  화려: moodFancy,
  메탈: moodStreet,
  스트릿: moodStreet,
  유니크: moodUnique,
  모던: moodChic,
};

export function getMoodImage(name: string): string | undefined {
  const key = Object.keys(MOOD_IMAGE_MAP).find((k) => name.startsWith(k));
  return key ? MOOD_IMAGE_MAP[key] : undefined;
}
