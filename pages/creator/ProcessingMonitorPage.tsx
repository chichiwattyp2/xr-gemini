
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ProcessingJob, JobStage } from '../../types';
import Spinner from '../../components/Spinner';
import Card, { CardContent, CardHeader } from '../../components/Card';
import NotFoundPage from '../NotFoundPage';
import Badge from '../../components/Badge';
import { CheckCircle, XCircle, Loader2, Circle } from 'lucide-react';

const ALL_STAGES: JobStage[] = [
    JobStage.Ingest,
    JobStage.Reconstruct,
    JobStage.TemporalStabilization,
    JobStage.Interpolation,
    JobStage.LODBaking,
    JobStage.Packaging,
    JobStage.CDNPublish,
];

const StageItem: React.FC<{ stage: JobStage; job: ProcessingJob }> = ({ stage, job }) => {
    const progress = job.stageProgress[stage] || 0;
    const isCurrent = job.currentStage === stage && job.status === 'Processing';
    const isCompleted = progress === 100 || (ALL_STAGES.indexOf(stage) < ALL_STAGES.indexOf(job.currentStage));
    
    let Icon = Circle;
    let iconColor = "text-gray-400";
    if (isCurrent) {
        Icon = Loader2;
        iconColor = "text-blue-500 animate-spin";
    } else if (isCompleted) {
        Icon = CheckCircle;
        iconColor = "text-green-500";
    } else if (job.status === 'Failed' && job.currentStage === stage) {
        Icon = XCircle;
        iconColor = "text-red-500";
    }

    return (
         <li className="mb-4">
            <div className="flex items-center space-x-3">
                <Icon className={`${iconColor} w-6 h-6 flex-shrink-0`} />
                <span className={`font-medium ${isCompleted || isCurrent ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500'}`}>{stage}</span>
            </div>
            {(isCurrent || (isCompleted && progress > 0 && progress < 100)) && (
                 <div className="mt-2 ml-9">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
                    </div>
                </div>
            )}
        </li>
    );
};

const ProcessingMonitorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<ProcessingJob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      const data = await api.getProcessingJobById(id);
      setJob(data || null);
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  // Simulate real-time progress updates
  useEffect(() => {
    if (!job || job.status !== 'Processing') return;

    const interval = setInterval(() => {
      setJob(prevJob => {
        if (!prevJob) return null;
        const newJob = { ...prevJob, stageProgress: {...prevJob.stageProgress} };
        const currentStage = newJob.currentStage;
        
        if (currentStage === JobStage.Complete || currentStage === JobStage.Failed) {
            clearInterval(interval);
            return newJob;
        }

        let currentProgress = newJob.stageProgress[currentStage] || 0;
        currentProgress += Math.random() * 10;

        if (currentProgress >= 100) {
            currentProgress = 100;
            const currentIndex = ALL_STAGES.indexOf(currentStage);
            if (currentIndex < ALL_STAGES.length - 1) {
                newJob.currentStage = ALL_STAGES[currentIndex + 1];
                newJob.logs.unshift(`Stage '${currentStage}' completed. Starting '${newJob.currentStage}'.`);
            } else {
                newJob.currentStage = JobStage.Complete;
                newJob.status = 'Published';
                newJob.logs.unshift('Processing complete and published to CDN!');
            }
        }
        newJob.stageProgress[currentStage] = currentProgress;
        return newJob;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [job]);

  if (loading) {
    return <div className="flex justify-center py-40"><Spinner size="lg" /></div>;
  }

  if (!job) {
    return <NotFoundPage />;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Processing: {job.experienceTitle}</h1>
        <div className="flex items-center space-x-4 mt-2">
            <Badge color={job.status === 'Processing' ? 'blue' : (job.status === 'Published' ? 'green' : 'red')}>Status: {job.status}</Badge>
            <p className="text-sm text-gray-500">Job ID: {job.id}</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><h2 className="font-semibold text-lg">Pipeline Stages</h2></CardHeader>
            <CardContent>
                <ul>
                    {ALL_STAGES.map(stage => <StageItem key={stage} stage={stage} job={job} />)}
                </ul>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-8">
            <Card>
                 <CardHeader><h2 className="font-semibold text-lg">WebGL Preview</h2></CardHeader>
                 <CardContent>
                    <div className="aspect-video bg-gray-900 flex items-center justify-center rounded-md">
                        <p className="text-gray-500">WebGL Orbit Preview (Placeholder)</p>
                    </div>
                 </CardContent>
            </Card>
             <Card>
                 <CardHeader><h2 className="font-semibold text-lg">Processing Logs</h2></CardHeader>
                 <CardContent>
                    <div className="bg-gray-900 text-white font-mono text-sm rounded-md p-4 h-64 overflow-y-auto">
                        {job.logs.map((log, i) => (
                            <p key={i} className={log.startsWith('ERROR') ? 'text-red-400' : 'text-gray-300'}>{`[${new Date().toLocaleTimeString()}] ${log}`}</p>
                        ))}
                    </div>
                 </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ProcessingMonitorPage;
