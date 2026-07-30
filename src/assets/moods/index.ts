import pure from './pure.png';
import chic from './chic.png';
import natural from './natural.png';
import cute from './cute.png';
import glam from './glam.png';
import metal from './metal.png';
import unique from './unique.png';

// GET /users/design-moods가 내려주는 name과 1:1로 맞춘다.
// (1 청순 / 2 시크 / 3 내추럴 / 4 아기자기 / 5 화려 / 6 메탈 / 7 유니크)
const MOOD_IMAGE_BY_NAME: Record<string, string> = {
  청순: pure,
  시크: chic,
  내추럴: natural,
  아기자기: cute,
  화려: glam,
  메탈: metal,
  유니크: unique,
};

export function getMoodImage(name: string): string | undefined {
  return MOOD_IMAGE_BY_NAME[name.trim()];
}
