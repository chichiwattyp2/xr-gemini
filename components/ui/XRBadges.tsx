import React from 'react';
import { Orbit, Tv, Smartphone, Headset, Layers, FastForward } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Quality, Interpolation } from '../../types';

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
}

const BaseBadge: React.FC<BadgeProps & { colorClasses: string }> = ({ className, children, colorClasses }) => (
  <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', colorClasses, className)}>
    {children}
  </span>
);

export const XRBadge: React.FC<{ type: '6DoF' | 'MR-Ready' }> = ({ type }) => {
  const isMR = type === 'MR-Ready';
  return (
    <BaseBadge colorClasses={isMR ? 'bg-accent-purple text-black' : 'bg-accent-blue text-black'}>
      {isMR ? <Tv size={12} className="mr-1.5" /> : <Orbit size={12} className="mr-1.5" />}
      {type}
    </BaseBadge>
  );
};

export const QualityBadge: React.FC<{ quality: Quality }> = ({ quality }) => {
  const colorMap = {
    [Quality.Base]: 'bg-yellow-400 text-black',
    [Quality.High]: 'bg-green-400 text-black',
    [Quality.Ultra]: 'bg-pink-400 text-black',
  };
  return (
    <BaseBadge colorClasses={colorMap[quality] || 'bg-gray-500'}>
        <Layers size={12} className="mr-1.5" />
        {quality} Quality
    </BaseBadge>
  );
};

export const InterpolationBadge: React.FC<{ interpolation: Interpolation }> = ({ interpolation }) => {
  if (interpolation === Interpolation.Off) return null;
  return (
    <BaseBadge colorClasses="bg-gray-200 text-black">
        <FastForward size={12} className="mr-1.5" />
        {interpolation}
    </BaseBadge>
  );
};

export const DeviceBadge: React.FC<{ device: 'android_xr' | 'quest' | 'pcvr' }> = ({ device }) => {
   const iconMap = {
       android_xr: <Smartphone size={12} className="mr-1.5" />,
       quest: <Headset size={12} className="mr-1.5" />,
       pcvr: <Tv size={12} className="mr-1.5" />,
   };
    const labelMap = {
       android_xr: 'Android XR',
       quest: 'Quest',
       pcvr: 'PCVR',
   };
  return (
    <BaseBadge colorClasses="bg-gray-600 text-white">
        {iconMap[device]}
        {labelMap[device]}
    </BaseBadge>
  );
};
