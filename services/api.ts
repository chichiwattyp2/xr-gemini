
// services/api.ts — MOCK endpoints for volusphere-production-pack
// This file provides a mock API that uses local data, making the application
// functional without a live backend. It has been updated to be STATEFUL.

import {
  Experience,
  ProcessingJob,
  AnalyticsData,
  Quality,
  Interpolation,
  JobStage,
  User,
  UserRole,
  Organization,
  ExperienceStatus,
} from '../types';
import { MOCK_EXPERIENCES, MOCK_JOBS, MOCK_ANALYTICS_DATA, MOCK_USERS, MOCK_ORGS } from '../data/mockData';


export interface CreateProjectPayload {
  title: string;
  description: string;
  tags: string[];
  privacy: 'Private' | 'Unlisted' | 'Public';
  devices: string[];
  defaultQuality: Quality;
  defaultInterpolation: Interpolation;
  posterUrl?: string;
}

// --- Stateful In-Memory Mock Store ---
let statefulExperiences = [...MOCK_EXPERIENCES];
let statefulJobs = [...MOCK_JOBS];
// ------------------------------------

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));


export const api = {
  authDelay: (): Promise<void> => sleep(300),

  getExperiences: async (): Promise<Experience[]> => {
    await sleep(500);
    return statefulExperiences;
  },

  getExperienceById: async (id: string): Promise<Experience> => {
    await sleep(300);
    const experience = statefulExperiences.find(exp => exp.id === id);
    if (!experience) throw new Error("Experience not found");
    return experience;
  },
  
  getLibrary: async (userId: string): Promise<string[]> => {
    const key = `volusphere_library_${userId}`;
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  },

  addToLibrary: async (userId: string, expId: string): Promise<boolean> => {
    const key = `volusphere_library_${userId}`;
    const list = await api.getLibrary(userId);
    if (!list.includes(expId)) list.push(expId);
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  },

  removeFromLibrary: async (userId: string, expId: string): Promise<boolean> => {
    const key = `volusphere_library_${userId}`;
    const list = (await api.getLibrary(userId)).filter((id) => id !== expId);
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  },

  createProject: async (data: CreateProjectPayload): Promise<ProcessingJob> => {
    await sleep(800);
    const newExpId = `exp_${Date.now()}`;
    const newJobId = `job_${Date.now()}`;

    const newExperience: Experience = {
      id: newExpId,
      title: data.title,
      description: data.description,
      tags: data.tags,
      creatorId: 'user_creator', // Hardcoded for mock
      creatorName: 'Casey',      // Hardcoded for mock
      version: 0,
      status: ExperienceStatus.Draft,
      devices: data.devices,
      mrReady: data.devices.includes('android_xr'),
      defaultQuality: data.defaultQuality,
      defaultInterpolation: data.defaultInterpolation,
      runtime: 'Processing',
      fileSize: 'Processing',
      minPlayArea: 'TBD',
      privacy: data.privacy,
      posterUrl: data.posterUrl || `https://picsum.photos/seed/${newExpId}/800/600`,
      trailerUrl: '',
      screenshotUrls: [],
      manifestUrl: '',
      createdAt: new Date().toISOString(),
    };
    statefulExperiences.unshift(newExperience);

    const newJob: ProcessingJob = {
      id: newJobId,
      experienceId: newExpId,
      experienceTitle: data.title,
      status: 'Processing',
      currentStage: JobStage.Ingest,
      stageProgress: { [JobStage.Ingest]: 10 },
      logs: ['[INFO] Job received. Starting ingest...'],
      thumbnails: [],
      startedAt: new Date().toISOString(),
      eta: '15 minutes',
    };
    statefulJobs.unshift(newJob);

    console.log("Created new project (stateful mock):", newJob);
    return newJob;
  },

  getProcessingJobs: async (): Promise<ProcessingJob[]> => {
    await sleep(400);
    return statefulJobs;
  },

  getProcessingJobById: async (id: string): Promise<ProcessingJob> => {
    await sleep(200);
    const job = statefulJobs.find(j => j.id === id);
    if (!job) throw new Error(`Job with ID ${id} not found.`);
    return job;
  },
  
  publishExperience: async (jobId: string, releaseNotes: string): Promise<ProcessingJob | undefined> => {
      await sleep(1000);
      const job = statefulJobs.find(j => j.id === jobId);
      if(job) {
          job.status = 'Published';
          const exp = statefulExperiences.find(e => e.id === job.experienceId);
          if (exp) {
              exp.status = ExperienceStatus.Published;
              exp.releaseNotes = releaseNotes;
              exp.version = (exp.version || 0) + 1;
              // Add to creator's library on publish
              const creator = MOCK_USERS[UserRole.Creator];
              api.addToLibrary(creator.id, exp.id);
          }
      }
      return job;
  },

  advanceJob: async (_jobId: string, _stage: JobStage): Promise<ProcessingJob | undefined> => {
    // The worker auto-advances in the real backend. This is a no-op in mock.
    return undefined;
  },

  getAnalyticsData: async (): Promise<AnalyticsData> => {
      await sleep(600);
      return MOCK_ANALYTICS_DATA;
  },
  
  getAdminStats: async (): Promise<any> => {
    await sleep(600);
    const a = MOCK_ANALYTICS_DATA;
    return {
      workersOnline: 10,
      queueDepth: statefulJobs.filter((j) => j.status === 'Queued' || j.status === 'Processing').length,
      failuresLastHour: statefulJobs.filter((j) => j.status === 'Failed').length,
      dau: a.dau[a.dau.length - 1].users,
      mau: a.mau[a.mau.length - 1].users,
      avgSessionSec: 930,
      completionPct: 82,
      deviceBreakdown: a.deviceBreakdown.map((d) => ({ name: d.device, value: d.value })),
      mrUsagePct: a.mrUsage.find(item => item.label === 'MR On')?.value || 0,
      lodDistribution: a.lodDistribution.map(d => ({name: d.quality, value: d.value})),
    };
  },
  
  getUsers: async (): Promise<User[]> => {
      await sleep(300);
      return Object.values(MOCK_USERS);
  },
  
  getOrganizations: async (): Promise<Organization[]> => {
      await sleep(300);
      return MOCK_ORGS;
  },
};
