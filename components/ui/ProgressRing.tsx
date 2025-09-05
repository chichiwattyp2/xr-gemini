import React from 'react';
import { Check, X, Loader } from 'lucide-react';

interface ProgressRingProps {
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  size?: number;
  strokeWidth?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ progress, status, size = 48, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  let colorClass = 'text-gray-400';
  if (status === 'completed') colorClass = 'text-green-500';
  if (status === 'processing') colorClass = 'text-blue-500';
  if (status === 'failed') colorClass = 'text-red-500';

  const Icon = () => {
    const iconSize = size / 2;
    switch (status) {
      case 'completed':
        return <Check size={iconSize} className="text-green-500" />;
      case 'failed':
        return <X size={iconSize} className="text-red-500" />;
      case 'processing':
         return <Loader size={iconSize} className="text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className="text-gray-300 dark:text-gray-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${colorClass} transition-all duration-300`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute">
        <Icon />
      </div>
    </div>
  );
};

export default ProgressRing;
