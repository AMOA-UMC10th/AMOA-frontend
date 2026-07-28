// 온보딩/재설정 화면의 디자인 무드 카드 이미지 (Figma 온보딩-선호 디자인에서 내려받음)
import pure from './pure.png';
import chic from './chic.png';
import natural from './natural.png';
import cute from './cute.png';
import glam from './glam.png';
import unique from './unique.png';
// Figma 레이어 이름은 '스트릿'으로 남아 있지만 실제 이미지는 메탈 디자인이다.
import metal from './metal.png';

// 서버는 무드를 이름(name)으로만 내려주고 이미지 URL은 주지 않아서, 이름으로 매칭한다.
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
