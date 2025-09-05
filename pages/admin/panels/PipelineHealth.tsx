import React, { useState, useEffect } from 'react';
import Card, { CardContent, CardHeader } from '../../../components/Card';
import { api } from '../../../services/api';
import { ProcessingJob } from '../../../types';
import Spinner from '../../../components/Spinner';
import Badge from '../../../components/Badge';
import { Server, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Published': return 'green';
        case 'Processing': return 'blue';
        case 'Failed': return 'red';
        case 'Queued': return 'yellow';
        default: return 'gray';
    }
};

interface PipelineStats {
    workersOnline: number;
    queueDepth: number;
    failuresLastHour: number;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType, iconColor?: string }> = ({ title, value, icon: Icon, iconColor = 'text-primary-500' }) => (
    <Card>
        <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
                <Icon className={`w-8 h-8 ${iconColor}`} />
                <div>
                    <p className="text-sm text-gray-400">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const PipelineHealth: React.FC = () => {
    const [jobs, setJobs] = useState<ProcessingJob[]>([]);
    const [stats, setStats] = useState<PipelineStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [jobData, statsData] = await Promise.all([
                api.getProcessingJobs(),
                api.getAdminStats()
            ]);
            setJobs(jobData);
            setStats(statsData);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading || !stats) {
        return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Workers Online" value={`${stats.workersOnline} / 10`} icon={Server} iconColor="text-green-500"/>
                <StatCard title="Jobs in Queue" value={stats.queueDepth} icon={Clock} iconColor="text-yellow-500"/>
                <StatCard title="Failures (24h)" value={stats.failuresLastHour} icon={AlertTriangle} iconColor="text-red-500"/>
            </div>
             <Card>
                <CardHeader><h3 className="font-semibold">Recent Job Activity</h3></CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th className="p-4 font-semibold">Experience</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">Current Stage</th>
                                    <th className="p-4 font-semibold">Started At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.slice(0, 10).map(job => (
                                    <tr key={job.id} className="border-b border-gray-700 last:border-b-0">
                                        <td className="p-4 font-medium">{job.experienceTitle}</td>
                                        <td className="p-4">
                                            <Badge color={getStatusColor(job.status)}>{job.status}</Badge>
                                        </td>
                                        <td className="p-4">{job.currentStage}</td>
                                        <td className="p-4 text-sm text-gray-400">{new Date(job.startedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PipelineHealth;