
export enum MembershipTier {
  FREE = 'Gratuito',
  STANDARD = 'Estándar',
  PRO = 'Pro',
  ULTRA = 'Ultra'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: MembershipTier;
  avatar: string;
  verified: boolean;
}

export interface CloudFile {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'video' | 'design';
  updatedAt: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
