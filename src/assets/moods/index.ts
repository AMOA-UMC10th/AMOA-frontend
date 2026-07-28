import pure from './pure.png';
import chic from './chic.png';
import natural from './natural.png';
import cute from './cute.png';
import glam from './glam.png';
import unique from './unique.png';
import street from './street.png';

const MOOD_IMAGE_BY_NAME: Record<string, string> = {
  청순: pure,
  시크: chic,
  내추럴: natural,
  아기자기: cute,
  화려: glam,
  스트릿: street,
  유니크: unique,
};

export function getMoodImage(name: string): string | undefined {
  return MOOD_IMAGE_BY_NAME[name.trim()];
}