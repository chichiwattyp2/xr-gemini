
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Experience } from '../../types';
import ExperienceCard from '../../components/ExperienceCard';
import Spinner from '../../components/Spinner';

const TechDemosPage: React.FC = () => {
    const [demos, setDemos] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDemos = async () => {
            setLoading(true);
            const allExperiences = await api.getExperiences();
            const techDemos = allExperiences.filter(exp => exp.tags.includes('Tech Demo'));
            setDemos(techDemos);
            setLoading(false);
        };
        fetchDemos();
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center">
                <h1 className="text-4xl font-bold">Technology Demonstrations</h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Explore curated experiences that push the boundaries of volumetric capture and showcase the cutting-edge features of the VoluSphere platform.
                </p>
            </header>
            
            {loading ? (
                <div className="flex justify-center py-20">
                  <Spinner text="Loading demos..." size="lg" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {demos.map(demo => (
                        <ExperienceCard key={demo.id} experience={demo} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TechDemosPage;
