import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProgressRing from './ProgressRing';

interface LessonCardProps {
  // FIX: Specify that the icon element can accept a size prop.
  icon?: React.ReactElement<{ size?: number }>;
  title: string;
  description: string;
  progress: number; // 0-100
  linkTo: string;
}

const LessonCard: React.FC<LessonCardProps> = ({ icon, title, description, progress, linkTo }) => {
  return (
    <Link to={linkTo} className="block group p-6 glass rounded-2xl hover:border-white/20 transition-all duration-300 focus-ring glow glow-purple">
      <div className="flex justify-between items-start">
        <div>
           {icon && <div className="mb-4 text-accent-purple">{React.cloneElement(icon, { size: 32 })}</div>}
          <h3 className="font-bold text-lg text-white">{title}</h3>
        </div>
        <ProgressRing progress={progress} status={progress > 0 ? 'processing' : 'pending'} />
      </div>
      <p className="text-gray-400 mt-2 text-sm">{description}</p>
      <div className="flex items-center mt-4 text-sm font-semibold text-accent-purple group-hover:translate-x-1 transition-transform">
        <span>Start Learning</span>
        <ChevronRight size={16} className="ml-1" />
      </div>
    </Link>
  );
};

export default LessonCard;
