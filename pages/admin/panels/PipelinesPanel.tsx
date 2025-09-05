
import React, { useState, useEffect } from 'react';
import Card, { CardContent, CardHeader } from '../../../components/Card';
import { api } from '../../../services/api';
import { ProcessingJob } from '../../../types';
import Spinner from '../../../components/Spinner';
import Badge from '../../../components/Badge';
import { HardDrive } from 'lucide-react';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Published': return 'green';
        case 'Processing': return 'blue';
        case 'Failed': return 'red';
        default: return 'gray';
    }
};

const PipelinesPanel: React.FC = () => {
    const [jobs, setJobs] = useState<ProcessingJob[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            const data = await api.getProcessingJobs();
            setJobs(data);
            setLoading(false);
        };
        fetchJobs();
    }, []);

    const stats = {
        processing: jobs.filter(j => j.status === 'Processing').length,
        queued: jobs.filter(j => j.status === 'Queued').length,
        failed: jobs.filter(j => j.status === 'Failed').length,
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="pt-6 flex items-center space-x-3">
                        <HardDrive className="w-8 h-8 text-green-500" />
                        <div>
                            <p className="text-sm text-gray-500">Workers</p>
                            <p className="text-2xl font-bold">10/10</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-gray-500">Processing</p>
                        <p className="text-3xl font-bold">{stats.processing}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-gray-500">Queued</p>
                        <p className="text-3xl font-bold">{stats.queued}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-gray-500">Failures (24h)</p>
                        <p className="text-3xl font-bold text-red-500">{stats.failed}</p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader><h3 className="font-semibold">Recent Jobs</h3></CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-20"><Spinner /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="p-4 font-semibold">Job ID</th>
                                        <th className="p-4 font-semibold">Experience</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 font-semibold">Started At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.slice(0, 10).map(job => (
                                        <tr key={job.id} className="border-b dark:border-gray-700 last:border-b-0">
                                            <td className="p-4 font-mono text-xs">{job.id}</td>
                                            <td className="p-4 font-medium">{job.experienceTitle}</td>
                                            <td className="p-4">
                                                <Badge color={getStatusColor(job.status)}>{job.status}</Badge>
                                            </td>
                                            <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{new Date(job.startedAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PipelinesPanel;