
export enum TargetAudience {
  KIDS = 'Niños y Adolescentes',
  PARENTS = 'Padres y Educadores'
}

export enum Category {
  TIP = 'Consejo o Tip Financiero',
  CHALLENGE = 'Reto',
  CURIOSITY = 'Curiosidad o Cultura'
}

export enum SocialFormat {
  INSTAGRAM = 'Instagram (1:1)',
  FACEBOOK = 'Facebook (1.91:1)',
  TIKTOK = 'TikTok (9:16)'
}

export interface FlyerContent {
  title: string;
  description: string;
  points: string[];
  callToAction: string;
  hashtags: string[];
  caption: string; // El texto que acompaña la imagen
}

export interface FlyerState {
  target: TargetAudience;
  category: Category;
  format: SocialFormat;
  userPrompt: string; // Pedido personalizado del usuario
  content: FlyerContent | null;
  imageUrl: string | null;
}
