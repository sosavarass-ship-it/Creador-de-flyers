
import { SocialFormat } from './types';

export const COLORS = {
  primary: '#2a75a0', // Blue from logo
  secondary: '#e86b32', // Orange from logo
  accent: '#f7b731', // Yellow from logo
  background: '#fffdf9',
};

export const FORMAT_RATIOS: Record<SocialFormat, string> = {
  [SocialFormat.INSTAGRAM]: 'aspect-square',
  [SocialFormat.FACEBOOK]: 'aspect-[1.91/1]',
  [SocialFormat.TIKTOK]: 'aspect-[9/16]',
};

export const FORMAT_CLASSES: Record<SocialFormat, string> = {
  [SocialFormat.INSTAGRAM]: 'w-full max-w-[500px]',
  [SocialFormat.FACEBOOK]: 'w-full max-w-[600px]',
  [SocialFormat.TIKTOK]: 'w-full max-w-[350px]',
};
