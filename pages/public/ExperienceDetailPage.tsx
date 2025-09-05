import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Experience } from '../../types';
import Spinner from '../../components/Spinner';
import NotFoundPage from '../NotFoundPage';
import Button from '../../components/Button';
import { Download, Smartphone, Layers, Maximize, Bookmark, Headset, BookmarkCheck, History, BrainCircuit } from 'lucide-react';
import { XRBadge, QualityBadge, InterpolationBadge, DeviceBadge } from '../../components/ui/XRBadges';
import LessonCard from '../../components/ui/LessonCard';

interface ManifestData {
    id: string;
    title: string;
    devices: string[];
    mrReady: boolean;
    defaultQuality: string;
    defaultInterpolation: string;
    minPlayArea: string;
}

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
  const [manifestData, setManifestData] = useState<ManifestData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated, isInLibrary, addToLibrary, removeFromLibrary } = useAuth();

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getExperienceById(id);
        setExperience(data || null);
        if (data && data.manifestUrl) {
            // In a real app, you'd fetch from the absolute URL. For this demo, we fetch from public folder.
            const response = await fetch(data.manifestUrl);
            const manifest = await response.json();
            setManifestData(manifest);
        }
      } catch (error) {
        console.error("Failed to fetch experience or manifest:", error);
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
  
  const inLibrary = isInLibrary(experience.id);

  const handleToggleLibrary = () => {
      if (inLibrary) {
          removeFromLibrary(experience.id);
      } else {
          addToLibrary(experience.id);
      }
  };

  const handleOpenInXR = () => {
    if (!experience) return;
    
    const deepLink = `voluspherexr://open?expId=${experience.id}`;
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.volusphere.viewer'; // Placeholder URL

    const opener = window.open(deepLink, '_blank');
    
    // Fallback for browsers that block the pop-up or if the custom protocol is not handled
    setTimeout(() => {
        if (opener === null || opener.closed) {
             if (window.confirm("App not found. Would you like to go to the Play Store?")) {
                window.open(playStoreUrl, '_blank');
            }
        }
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
       {/* Header */}
      <div className="relative aspect-video rounded-2xl overflow-hidden glass">
         <img src={experience.posterUrl.replace('/800/600', '/1280/720')} alt={experience.title} className="w-full h-full object-cover"/>
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 flex flex-col justify-end">
            <h1 className="text-4xl font-bold text-white">{experience.title}</h1>
            <p className="text-gray-300 text-lg">by {experience.creatorName}</p>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column: Description & Specs */}
        <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-300 whitespace-pre-line">{experience.description}</p>
              {experience.releaseNotes && (
                <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                    <p className="font-semibold flex items-center"><History className="w-4 h-4 mr-2"/>Version {experience.version}.0 Notes</p>
                    <p className="text-gray-400 text-sm mt-1">{experience.releaseNotes}</p>
                </div>
              )}
            </div>

             <div>
                <h2 className="text-2xl font-bold mb-4">Features & Requirements</h2>
                <div className="flex flex-wrap gap-3">
                  <XRBadge type="6DoF" />
                  {manifestData?.mrReady && <XRBadge type="MR-Ready" />}
                  {manifestData && <QualityBadge quality={manifestData.defaultQuality as any} />}
                  {manifestData && <InterpolationBadge interpolation={manifestData.defaultInterpolation as any} />}
                  {manifestData?.devices.map(device => <DeviceBadge key={device} device={device as any} />)}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-700">
                <SpecItem icon={<Maximize />} label="Min Play Area" value={manifestData?.minPlayArea || 'N/A'} />
                <SpecItem icon={<Download />} label="File Size" value={experience.fileSize} />
                <SpecItem icon={<Layers />} label="Version" value={`${experience.version}.0`} />
             </div>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-1">
           <div className="p-6 glass rounded-2xl sticky top-24 space-y-4">
                <h3 className="text-xl font-bold text-center">Launch Experience</h3>
                <Button size="lg" className="w-full focus-ring" onClick={handleOpenInXR}>
                    <Smartphone className="mr-2" /> Open on Android XR
                </Button>
                <Button size="lg" variant="secondary" className="w-full focus-ring" disabled>
                    <Headset className="mr-2" /> Open on Quest
                </Button>
                {isAuthenticated && (
                     <Button size="lg" variant={inLibrary ? "outline" : "secondary"} className="w-full focus-ring" onClick={handleToggleLibrary}>
                        {inLibrary ? <BookmarkCheck className="mr-2" /> : <Bookmark className="mr-2" />}
                        {inLibrary ? "In Library" : "Add to Library"}
                    </Button>
                )}
           </div>
        </div>
      </div>

       {/* Screenshots Section */}
      {experience.screenshotUrls && experience.screenshotUrls.length > 0 && (
        <div className="pt-8">
          <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {experience.screenshotUrls.map((url, index) => (
              <a key={index} href={url} target="_blank" rel="noreferrer" className="block aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-md group focus-ring">
                <img src={url} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Learn More Section */}
      <div className="pt-8 border-t border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Learn More</h2>
          <div className="grid md:grid-cols-3 gap-8">
             <LessonCard 
                icon={<BrainCircuit/>}
                title="What is Gaussian Splatting?"
                description="Discover the tech that makes 6-DoF volumetric video possible."
                progress={0}
                linkTo="/creator-guide"
            />
             <LessonCard 
                title="LODs & Performance"
                description="Learn how Levels of Detail ensure a smooth experience on any device."
                progress={0}
                linkTo="/viewer-spec"
            />
             <LessonCard 
                title="The Magic of MR Passthrough"
                description="Explore how experiences can blend with your real-world environment."
                progress={0}
                linkTo="/viewer-spec"
            />
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetailPage;