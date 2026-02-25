import { Service } from '@/lib/api';
import {
  BookOpen, Award, School, Briefcase, Users, Package,
  Star, Heart, Globe, Zap, Shield, Leaf, type LucideIcon,
} from 'lucide-react';

interface Props {
  service: Service;
}

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Award,
  School,
  Briefcase,
  Users,
  Package,
  Star,
  Heart,
  Globe,
  Zap,
  Shield,
  Leaf,
};

const colors = [
  'from-primary-500 to-primary-600',
  'from-secondary-500 to-secondary-600',
  'from-purple-500 to-purple-600',
  'from-green-500 to-green-600',
  'from-pink-500 to-pink-600',
  'from-yellow-500 to-orange-500',
];

export default function ServiceCard({ service }: Props) {
  const Icon = (service.icone && iconMap[service.icone]) ? iconMap[service.icone] : Star;
  const gradient = colors[(service.ordre - 1) % colors.length] || colors[0];

  return (
    <article className="card p-6 group cursor-default hover:-translate-y-1 transition-all duration-300">
      {/* Icone */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-7 w-7 text-white" />
      </div>

      {/* Contenu */}
      <h3 className="text-gray-900 font-bold text-xl mb-3 group-hover:text-primary-600 transition-colors">
        {service.titre}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {service.description}
      </p>
    </article>
  );
}
