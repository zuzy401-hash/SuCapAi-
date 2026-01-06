
import React from 'react';
import { MembershipTier } from './types';
import { Shield, Zap, Crown, Star } from 'lucide-react';

export const MEMBERSHIP_PLANS = [
  {
    tier: MembershipTier.FREE,
    price: '$0 MXN',
    icon: <Shield className="w-6 h-6 text-gray-400" />,
    features: ['Chat de IA Básico', '1GB Almacenamiento Nube', 'Acceso Comunitario', 'Resolución Estándar'],
    color: 'border-gray-800'
  },
  {
    tier: MembershipTier.STANDARD,
    price: '$249 MXN',
    icon: <Star className="w-6 h-6 text-blue-400" />,
    features: ['Respuestas de IA Rápidas', '10GB Almacenamiento Nube', 'Exportaciones HD', 'Soporte Prioritario'],
    color: 'border-blue-500/50 bg-blue-500/5'
  },
  {
    tier: MembershipTier.PRO,
    price: '$599 MXN',
    icon: <Zap className="w-6 h-6 text-purple-400" />,
    features: ['Acceso a Gemini 3 Pro', '100GB Almacenamiento Nube', 'Exportaciones 4K', 'Asistencia por Voz'],
    color: 'border-purple-500/50 bg-purple-500/5',
    recommended: true
  },
  {
    tier: MembershipTier.ULTRA,
    price: '$1,199 MXN',
    icon: <Crown className="w-6 h-6 text-amber-400" />,
    features: ['Almacenamiento Ilimitado', 'Colaboración en Tiempo Real', 'Acceso Anticipado', 'Agente de IA Personal'],
    color: 'border-amber-500/50 bg-amber-500/5'
  }
];

export const MOCK_USER: any = {
  id: 'usr_1',
  name: 'Alex Rivera',
  email: 'alex@creador.io',
  tier: MembershipTier.PRO,
  avatar: 'https://picsum.photos/seed/alex/200',
  verified: true
};
