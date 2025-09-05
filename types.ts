export enum UserRole {
  Visitor = 'Visitor',
  Viewer = 'Viewer',
  Creator = 'Creator',
  Admin = 'Admin',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  orgId?: string;
  avatarUrl: string;
  library: string[]; // Array of experience IDs
}

export interface Organization {
    id: string;
    name: string;
    ownerId: string;
    seats: number;
    seatsUsed: number;
    plan: 'Creator' | 'Team';
}

export enum ExperienceStatus {
  Draft = 'Draft',
  Published = 'Published',
  Archived = 'Archived',
}

export enum Quality {
  Base = 'Base',
  High = 'High',
  Ultra = 'Ultra',
}

export enum Interpolation {
  Off = 'Off',
  FPS120 = '120fps',
  FPS240 = '240fps',
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  tags: string[];
  creatorId: string;
  creatorName: string;
  version: number;
  status: ExperienceStatus;
  devices: string[];
  mrReady: boolean;
  defaultQuality: Quality;
  defaultInterpolation: Interpolation;
  runtime: string; // e.g. "5m 30s"
  fileSize: string; // e.g. "1.2 GB"
  minPlayArea: string; // e.g. "2m x 2m"
  privacy: 'Private' | 'Unlisted' | 'Public';
  posterUrl: string;
  trailerUrl: string;
  screenshotUrls: string[];
  manifestUrl: string;
  createdAt: string;
  releaseNotes?: string;
}

export enum JobStage {
  Ingest = 'Ingest',
  Reconstruct = 'Reconstruct (Gaussian Splats)',
  TemporalStabilization = 'Temporal Stabilization',
  Interpolation = 'Interpolation',
  LODBaking = 'LOD Baking',
  Packaging = 'Packaging',
  CDNPublish = 'CDN Publish',
  Complete = 'Complete',
  Failed = 'Failed',
}

export interface ProcessingJob {
  id: string;
  experienceId: string;
  experienceTitle: string;
  status: 'Queued' | 'Processing' | 'Failed' | 'Published' | 'ReadyToPublish';
  currentStage: JobStage;
  stageProgress: { [key in JobStage]?: number }; // Progress percentage 0-100
  logs: string[];
  thumbnails: string[];
  startedAt: string;
  finishedAt?: string;
  eta: string;
}

export interface AnalyticsData {
  dau: { date: string, users: number }[];
  mau: { month: string, users: number }[];
  sessionLength: { bucket: string, count: number }[];
  deviceBreakdown: { device: string, value: number }[];
  mrUsage: { label: string, value: number }[];
  lodDistribution: { quality: Quality, value: number }[];
}