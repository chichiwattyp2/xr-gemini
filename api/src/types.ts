export type Quality = 'Base'|'High'|'Ultra';
export type Interp = 'Off'|'120fps'|'240fps';

export interface Experience {
  id: string;
  title: string;
  description: string;
  tags: string[];
  devices: string[];
  mrReady: boolean;
  defaultQuality: Quality;
  defaultInterpolation: Interp;
  manifestUrl: string;
  posterUrl: string;
  trailerUrl: string;
}

export interface Job {
  id: string;
  experienceId: string;
  title: string;
  status: 'Queued'|'Running'|'Failed'|'Success';
  stage: 1|2|3|4|5|6|7;
  logs: string[];
  eta?: string;
}
