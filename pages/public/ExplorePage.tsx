import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { Experience } from '../../types';
import ExperienceCard from '../../components/ExperienceCard';
import Spinner from '../../components/Spinner';
import FilterBar from '../../components/ui/FilterBar';
import Carousel3D from '../../components/ui/Carousel3D';

const ExplorePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({ searchTerm: '', tags: [], devices: [] });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      try {
        const data = await api.getExperiences();
        setExperiences(data.filter(exp => exp.status === 'Published'));
      } catch (error) {
        console.error("Failed to fetch experiences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);
  
  const featuredExperiences = useMemo(() => {
    return [...experiences].sort((a,b) => b.fileSize.localeCompare(a.fileSize)).slice(0, 5);
  }, [experiences]);

  const filteredAndSortedExperiences = useMemo(() => {
    let result = experiences.filter(exp => {
      const searchTermMatch = exp.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        exp.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      
      const tagsMatch = filters.tags.length === 0 || filters.tags.every(filterTag => 
        exp.tags.map(t => t.toLowerCase()).includes(filterTag)
      );

      const deviceMatch = filters.devices.length === 0 || filters.devices.every(filterDevice =>
        exp.devices.includes(filterDevice)
      );

      return searchTermMatch && tagsMatch && deviceMatch;
    });

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'trending') {
      result.sort((a, b) => b.fileSize.localeCompare(a.fileSize));
    }

    return result;
  }, [experiences, filters, sortBy]);

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Explore Experiences</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Discover the next dimension of storytelling.</p>
      </header>

      <FilterBar onFilterChange={setFilters} onSortChange={setSortBy} />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner text="Loading experiences..." size="lg" />
        </div>
      ) : (
        <div className="space-y-16">
          <section>
             <h2 className="text-2xl font-bold mb-6">Featured</h2>
             <Carousel3D>
              {featuredExperiences.map(exp => (
                <div key={exp.id} className="w-full h-full p-2">
                  <ExperienceCard experience={exp} />
                </div>
              ))}
            </Carousel3D>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-6">All Experiences</h2>
            {filteredAndSortedExperiences.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAndSortedExperiences.map(exp => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold">No experiences found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your filters.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;