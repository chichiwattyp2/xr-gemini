import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ProcessingJob, JobStage } from '../../types';
import Spinner from '../../components/Spinner';
import Card, { CardContent, CardHeader } from '../../components/Card';
import NotFoundPage from '../NotFoundPage';
import Badge from '../../components/Badge';
import { CheckCircle, XCircle, RefreshCw, X, AlertTriangle } from 'lucide-react';
import ProgressRing from '../../components/ui/ProgressRing';
import Button from '../../components/Button';

const ALL_STAGES: JobStage[] = [
    JobStage.Ingest,
    JobStage.Reconstruct,
    JobStage.TemporalStabilization,
    JobStage.Interpolation,
    JobStage.LODBaking,
    JobStage.Packaging,
    JobStage.CDNPublish,
];

const getStageStatus = (stage: JobStage, job: ProcessingJob): 'completed' | 'processing' | 'pending' | 'failed' => {
    const stageIndex = ALL_STAGES.indexOf(stage);
    const jobStageIndex = ALL_STAGES.indexOf(job.currentStage);

    if (job.status === 'Failed' && stageIndex === jobStageIndex) return 'failed';
    if (stageIndex < jobStageIndex) return 'completed';
    if (stageIndex === jobStageIndex && job.status !== 'Queued') return 'processing';
    if (job.status === 'Published' || job.status === 'ReadyToPublish') return 'completed';
    return 'pending';
};


const StageItem: React.FC<{ stage: JobStage; job: ProcessingJob }> = ({ stage, job }) => {
    const status = getStageStatus(stage, job);
    const progress = (status === 'completed') ? 100 : (job.stageProgress[stage] || 0);

    let statusColor = 'text-gray-400';
    if (status === 'completed') statusColor = 'text-green-500';
    if (status === 'processing') statusColor = 'text-blue-500';
    if (status === 'failed') statusColor = 'text-red-500';

    return (
         <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
             <ProgressRing progress={progress} status={status} />
             <div>
                <p className={`font-semibold ${status === 'pending' ? 'text-gray-500' : ''}`}>{stage}</p>
                {status === 'processing' && <p className="text-sm text-blue-400">In progress... {Math.round(progress)}%</p>}
                {status === 'completed' && <p className="text-sm text-green-400">Completed</p>}
                {status === 'failed' && <p className="text-sm text-red-400">Failed</p>}
                {status === 'pending' && <p className="text-sm text-gray-500">Pending</p>}
             </div>
        </div>
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
        if (prevJob.status !== 'Processing') {
          clearInterval(interval);
          return prevJob;
        }

        const newJob = { ...prevJob, stageProgress: {...prevJob.stageProgress}, logs: [...prevJob.logs] };
        const currentStage = newJob.currentStage;
        
        let currentProgress = newJob.stageProgress[currentStage] || 0;
        currentProgress += Math.random() * 15 + 5;

        if (currentProgress >= 100) {
            currentProgress = 100;
            newJob.stageProgress[currentStage] = 100;
            const currentIndex = ALL_STAGES.indexOf(currentStage);
            
            if (currentIndex < ALL_STAGES.length - 1) {
                newJob.currentStage = ALL_STAGES[currentIndex + 1];
                newJob.stageProgress[newJob.currentStage] = 0;
                newJob.logs.unshift(`Stage '${currentStage}' completed. Starting '${newJob.currentStage}'.`);
            } else {
                newJob.currentStage = JobStage.Complete;
                newJob.status = 'ReadyToPublish';
                newJob.finishedAt = new Date().toISOString();
                newJob.logs.unshift('Processing complete! Ready for final review and publishing.');
                clearInterval(interval);
            }
        } else {
           newJob.stageProgress[currentStage] = currentProgress;
        }
        return newJob;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [job?.status]);

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
            <Badge color={job.status === 'Processing' ? 'blue' : (job.status === 'Published' || job.status === 'ReadyToPublish' ? 'green' : 'red')}>Status: {job.status}</Badge>
            <p className="text-sm text-gray-500">Job ID: {job.id}</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader><h2 className="font-semibold text-lg">Pipeline Stages</h2></CardHeader>
              <CardContent className="space-y-3">
                  {ALL_STAGES.map(stage => <StageItem key={stage} stage={stage} job={job} />)}
              </CardContent>
            </Card>
            {job.status === 'Failed' && (
                <Card className="border-red-500/50">
                    <CardHeader className="flex items-center space-x-3"><AlertTriangle className="text-red-500"/> <h2 className="font-semibold text-lg text-red-400">Job Failed</h2></CardHeader>
                    <CardContent className="space-y-4">
                        <p>The job failed during the '{job.currentStage}' stage. Check the logs for more details.</p>
                        <div className="flex space-x-2">
                            <Button size="sm" variant="secondary"><RefreshCw className="w-4 h-4 mr-2"/>Retry Job</Button>
                            <Button size="sm" variant="outline">Cancel Job</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
             {job.status === 'ReadyToPublish' && (
                <Card className="border-purple-500/50">
                    <CardHeader className="flex items-center space-x-3"><CheckCircle className="text-purple-500"/> <h2 className="font-semibold text-lg text-purple-400">Ready to Publish</h2></CardHeader>
                    <CardContent className="space-y-4">
                        <p>Processing is complete. You can now add release notes and publish your experience.</p>
                        <Link to={`/creator/publish/${job.id}`}>
                            <Button size="sm" variant="primary">Review & Publish</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
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
                    <div className="bg-gray-900 text-white font-mono text-sm rounded-md p-4 h-96 overflow-y-auto">
                        {job.logs.map((log, i) => (
                            <p key={i} className={`whitespace-pre-wrap ${log.startsWith('ERROR') ? 'text-red-400' : 'text-gray-300'}`}>{`[${new Date().toLocaleTimeString()}] ${log}`}</p>
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