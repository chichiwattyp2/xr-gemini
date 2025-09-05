import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ProcessingJob, Experience } from '../../types';
import Spinner from '../../components/Spinner';
import Card, { CardContent, CardHeader, CardFooter } from '../../components/Card';
import NotFoundPage from '../NotFoundPage';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

const PublishPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<ProcessingJob | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [releaseNotes, setReleaseNotes] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const jobData = await api.getProcessingJobById(id);
        setJob(jobData || null);
        if (jobData) {
            const expData = await api.getExperienceById(jobData.experienceId);
            setExperience(expData || null);
            setReleaseNotes(expData?.releaseNotes || '');
        }
      } catch (error) {
        console.error("Failed to fetch job/experience:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePublish = async () => {
    if (!job) return;
    setIsPublishing(true);
    try {
        await api.publishExperience(job.id, releaseNotes);
        navigate('/creator/dashboard');
    } catch (error) {
        console.error("Failed to publish experience:", error);
        setIsPublishing(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-40"><Spinner size="lg" /></div>;
  }

  if (!job || !experience) {
    return <NotFoundPage />;
  }
  
  if (job.status !== 'ReadyToPublish') {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold">This project is not ready to publish.</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                Its current status is: <Badge color={job.status === 'Processing' ? 'blue' : 'gray'}>{job.status}</Badge>
            </p>
            <Link to="/creator/dashboard" className="mt-8">
                <Button>Back to Dashboard</Button>
            </Link>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Review & Publish: {job.experienceTitle}</h1>
        <p className="text-gray-500 dark:text-gray-400">Finalize the details and release your experience to the world.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Card>
                 <CardHeader><h2 className="font-semibold text-lg">WebGL Preview</h2></CardHeader>
                 <CardContent>
                    <div className="aspect-video bg-gray-900 flex items-center justify-center rounded-md">
                        <p className="text-gray-500">WebGL Orbit Preview (Placeholder)</p>
                    </div>
                 </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
             <Card>
                <CardHeader><h2 className="font-semibold text-lg">Publishing Details</h2></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label htmlFor="version" className="block text-sm font-medium mb-1">New Version</label>
                        <p className="font-semibold text-lg">{experience.version + 1}.0 <span className="text-sm text-gray-400">(from {experience.version}.0)</span></p>
                    </div>
                     <div>
                        <label htmlFor="releaseNotes" className="block text-sm font-medium mb-1">Release Notes</label>
                         <textarea
                            id="releaseNotes"
                            value={releaseNotes}
                            onChange={(e) => setReleaseNotes(e.target.value)}
                            rows={6}
                            className="w-full form-input"
                            placeholder="e.g., 'Improved lighting and temporal stabilization.'"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                     <Button size="lg" className="w-full" isLoading={isPublishing} onClick={handlePublish}>
                        Publish Experience
                    </Button>
                </CardFooter>
             </Card>
        </div>
      </div>
    </div>
  );
};

export default PublishPage;