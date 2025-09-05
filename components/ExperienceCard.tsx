
import React from 'react';
import { Link } from 'react-router-dom';
import { Experience } from '../types';
import Card from './Card';
import Badge from './Badge';
import { Eye, User, Tag, Tv, Code } from 'lucide-react';

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  return (
    <Link to={`/experience/${experience.id}`} className="block group">
      <Card className="h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <div className="relative">
          <img src={experience.posterUrl} alt={experience.title} className="w-full h-48 object-cover" />
          <div className="absolute top-2 right-2 flex flex-col space-y-1">
            {experience.mrReady && <Badge color="purple">MR Ready</Badge>}
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-bold group-hover:text-primary-500 transition-colors">{experience.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">by {experience.creatorName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 flex-grow">{experience.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {experience.tags.slice(0, 3).map(tag => <Badge key={tag}>{tag}</Badge>)}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
          <span>{experience.runtime}</span>
          <span>{experience.fileSize}</span>
        </div>
      </Card>
    </Link>
  );
};

export default ExperienceCard;
