import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Experience } from '../../types';
import Spinner from '../../components/Spinner';
import NotFoundPage from '../NotFoundPage';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Download, Smartphone, Tv, Computer, Layers, Orbit, Maximize, FileJson, Bookmark } from 'lucide-react';

// FIX: Specify that the icon element can accept a size prop.
const SpecItem: React.FC<{ icon: React.ReactElement<{ size?: number }>, label: string, value: string | React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
        <div className="mt-1 text-gray-400">{React.cloneElement(icon, { size: 20 })}</div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </div>
);

const ExperienceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getExperienceById(id);
        setExperience(data || null);
      } catch (error) {
        console.error("Failed to fetch experience:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-40"><Spinner size="lg" /></div>;
  }

  if (!experience) {
    return <NotFoundPage />;
  }

  const deepLink = `voluspherexr://open?expId=${experience.id}`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column: Media */}
        <div className="lg:col-span-2">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-4">
                 <img src={experience.posterUrl.replace('/800/600', '/1280/720')} alt="Experience trailer" className="w-full h-full object-cover" />
            </div>
            {/* Screenshots could go here */}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-1 space-y-6">
            <h1 className="text-3xl font-bold">{experience.title}</h1>
            <p className="text-gray-500 dark:text-gray-400">by {experience.creatorName}</p>
            <p>{experience.description}</p>
            
            <div className="flex flex-wrap gap-2">
                {experience.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button size="lg" className="w-full" onClick={() => window.location.href = deepLink}>
                    <Smartphone className="mr-2" /> Open on Android XR
                </Button>
                <Button size="lg" variant="secondary" className="w-full">
                    <Bookmark className="mr-2" /> Add to Library
                </Button>
            </div>
        </div>
      </div>
      
      {/* Specs Section */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Specifications & Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <SpecItem icon={<Orbit />} label="Interactivity" value="6DoF" />
              <SpecItem icon={<Layers />} label="Quality" value={experience.defaultQuality} />
              <SpecItem icon={<Layers />} label="Interpolation" value={experience.defaultInterpolation} />
              <SpecItem icon={<Maximize />} label="Min Play Area" value={experience.minPlayArea} />
              <SpecItem icon={<Download />} label="File Size" value={experience.fileSize} />
              <SpecItem 
                icon={<Tv />} 
                label="Supported Devices" 
                value={<div className="flex flex-wrap gap-1 mt-1">{experience.devices.map(d => <Badge color="blue" key={d}>{d}</Badge>)}</div>}
              />
              <SpecItem 
                icon={<FileJson />} 
                label="Manifest URL" 
                value={<a href={experience.manifestUrl} target="_blank" rel="noreferrer" className="text-primary-500 hover:underline text-sm break-all">View Manifest</a>}
              />
          </div>
      </div>
    </div>
  );
};

export default ExperienceDetailPage;