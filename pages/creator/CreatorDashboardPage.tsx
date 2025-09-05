
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ProcessingJob, JobStage } from '../../types';
import Spinner from '../../components/Spinner';
import Card, { CardContent, CardHeader } from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { PlusCircle, Database, Clock } from 'lucide-react';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Published': return 'green';
        case 'Processing': return 'blue';
        case 'Failed': return 'red';
        case 'ReadyToPublish': return 'purple';
        default: return 'gray';
    }
};

const CreatorDashboardPage: React.FC = () => {
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Creator Hub</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your projects, monitor jobs, and publish releases.</p>
        </div>
        <Link to="/creator/new">
          <Button>
            <PlusCircle className="mr-2" /> New Project
          </Button>
        </Link>
      </div>

      {/* Usage Meters */}
      <div className="grid md:grid-cols-2 gap-6">
          <Card>
              <CardContent className="flex items-center space-x-4">
                  <Database className="w-10 h-10 text-primary-500"/>
                  <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Storage Used</p>
                      <p className="text-2xl font-bold">35.2 GB / 50 GB</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                         <div className="bg-primary-600 h-2.5 rounded-full" style={{width: '70.4%'}}></div>
                      </div>
                  </div>
              </CardContent>
          </Card>
           <Card>
              <CardContent className="flex items-center space-x-4">
                  <Clock className="w-10 h-10 text-primary-500"/>
                  <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Processing Time</p>
                      <p className="text-2xl font-bold">68 mins / 100 mins</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                         <div className="bg-yellow-500 h-2.5 rounded-full" style={{width: '68%'}}></div>
                      </div>
                  </div>
              </CardContent>
          </Card>
      </div>

      <Card>
          <CardHeader>
              <h2 className="text-xl font-semibold">My Projects</h2>
          </CardHeader>
          <CardContent className="p-0">
              {loading ? (
                  <div className="p-20"><Spinner /></div>
              ) : (
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50 dark:bg-gray-700/50">
                              <tr>
                                  <th className="p-4 font-semibold">Title</th>
                                  <th className="p-4 font-semibold">Status</th>
                                  <th className="p-4 font-semibold">Current Stage</th>
                                  <th className="p-4 font-semibold">Started At</th>
                                  <th className="p-4 font-semibold">Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {jobs.map(job => (
                                  <tr key={job.id} className="border-b dark:border-gray-700 last:border-b-0">
                                      <td className="p-4 font-medium">{job.experienceTitle}</td>
                                      <td className="p-4">
                                          <Badge color={getStatusColor(job.status)}>{job.status}</Badge>
                                      </td>
                                      <td className="p-4">{job.status === 'Published' ? 'Completed' : job.currentStage}</td>
                                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{new Date(job.startedAt).toLocaleString()}</td>
                                      <td className="p-4">
                                          {job.status === 'ReadyToPublish' ? (
                                            <Link to={`/creator/publish/${job.id}`}>
                                                <Button size="sm">Review & Publish</Button>
                                            </Link>
                                          ) : (
                                            <Link to={`/creator/job/${job.id}`}>
                                                <Button variant="outline" size="sm">View Progress</Button>
                                            </Link>
                                          )}
                                      </td>
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

export default CreatorDashboardPage;