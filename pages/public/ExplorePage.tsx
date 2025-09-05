import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { Experience } from '../../types';
import ExperienceCard from '../../components/ExperienceCard';
import Spinner from '../../components/Spinner';
import { Search } from 'lucide-react';

const ExplorePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  // FIX: Correctly initialize state with useState.
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      try {
        const data = await api.getExperiences();
        setExperiences(data);
      } catch (error) {
        console.error("Failed to fetch experiences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const filteredAndSortedExperiences = useMemo(() => {
    let result = experiences.filter(exp =>
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'trending') {
      // Simple trending sort for demo, can be replaced with real logic
      result.sort((a, b) => b.fileSize.localeCompare(a.fileSize));
    }

    return result;
  }, [experiences, searchTerm, sortBy]);

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Explore Experiences</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Discover the next dimension of storytelling.</p>
      </header>

      <div className="sticky top-16 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 z-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search experiences or tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner text="Loading experiences..." size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedExperiences.map(exp => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;