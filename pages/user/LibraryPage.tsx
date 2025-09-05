import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Experience } from '../../types';
import ExperienceCard from '../../components/ExperienceCard';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import { Library } from 'lucide-react';

const LibraryPage: React.FC = () => {
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { library } = useAuth();

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      try {
        const data = await api.getExperiences();
        setAllExperiences(data);
      } catch (error) {
        console.error("Failed to fetch experiences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const libraryExperiences = useMemo(() => {
    return allExperiences.filter(exp => library.includes(exp.id));
  }, [allExperiences, library]);

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold">My Library</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Your collection of saved experiences.</p>
      </header>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner text="Loading your library..." size="lg" />
        </div>
      ) : libraryExperiences.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {libraryExperiences.map(exp => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-2xl">
          <Library className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-xl font-semibold">Your library is empty</h3>
          <p className="mt-1 text-gray-400">Add experiences to your library to see them here.</p>
          <div className="mt-6">
            <Link to="/explore">
                <Button>Explore Experiences</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;