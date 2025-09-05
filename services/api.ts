
import { MOCK_EXPERIENCES, MOCK_JOBS, MOCK_ANALYTICS_DATA } from '../data/mockData';
import { Experience, ProcessingJob, AnalyticsData } from '../types';

const API_LATENCY = 500; // ms

const simulateApiCall = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(data))); // Deep copy to prevent mutation
    }, API_LATENCY);
  });
};

export const api = {
  getExperiences: (): Promise<Experience[]> => {
    return simulateApiCall(MOCK_EXPERIENCES);
  },
  getExperienceById: (id: string): Promise<Experience | undefined> => {
    const experience = MOCK_EXPERIENCES.find(exp => exp.id === id);
    return simulateApiCall(experience);
  },
  getProcessingJobs: (): Promise<ProcessingJob[]> => {
    return simulateApiCall(MOCK_JOBS);
  },
  getProcessingJobById: (id: string): Promise<ProcessingJob | undefined> => {
    const job = MOCK_JOBS.find(j => j.id === id);
    return simulateApiCall(job);
  },
  getAnalyticsData: (): Promise<AnalyticsData> => {
    return simulateApiCall(MOCK_ANALYTICS_DATA);
  },
  startNewProject: (data: { title: string, description: string }): Promise<ProcessingJob> => {
     const newJob: ProcessingJob = {
        id: `job_${Date.now()}`,
        experienceId: `exp_${Date.now()}`,
        experienceTitle: data.title,
        status: 'Queued',
        currentStage: MOCK_JOBS[0].currentStage,
        stageProgress: {},
        logs: ['Job created and queued for processing.'],
        thumbnails: [],
        startedAt: new Date().toISOString(),
        eta: '15 minutes',
     };
     MOCK_JOBS.unshift(newJob);
     return simulateApiCall(newJob);
  }
};
