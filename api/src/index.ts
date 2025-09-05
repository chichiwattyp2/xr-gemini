import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { nanoid } from 'nanoid';
import { createQueue, createWorker } from './queue.js';
import { store } from './storage.js';
import { Experience, Job } from './types.js';
import { URL } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const PUBLIC_BASE = process.env.PUBLIC_BASE || `http://localhost:${PORT}`;

const { queue } = createQueue(new URL(REDIS_URL));

// Serve manifests statically
app.get('/manifests/:id.json', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'data', 'manifests', `${req.params.id}.json`));
});

// Experiences
app.get('/api/experiences', (req, res)=> res.json(store.listExperiences()));
app.get('/api/experiences/:id', (req, res)=>{
  const exp = store.listExperiences().find(e => e.id === req.params.id);
  if(!exp) return res.status(404).json({ error: 'Not found' });
  res.json(exp);
});

// Jobs
app.get('/api/jobs', (req, res)=> res.json(store.listJobs()));
app.get('/api/jobs/:id', (req, res)=>{
  const job = store.listJobs().find(j => j.id === req.params.id);
  if(!job) return res.status(404).json({ error: 'Not found' });
  res.json(job);
});

// Projects: create project + enqueue pipeline + seed manifest
app.post('/api/projects', async (req, res)=>{
  const body = req.body || {};
  const expId = `exp_${nanoid(8)}`;
  const jobId = `job_${nanoid(8)}`;

  const exp: Experience = {
    id: expId,
    title: body.title || 'Untitled',
    description: body.description || '',
    tags: body.tags || [],
    devices: body.devices || ['Android XR'],
    mrReady: true,
    defaultQuality: body.defaultQuality || 'High',
    defaultInterpolation: body.defaultInterpolation || '120fps',
    posterUrl: body.posterUrl || 'https://picsum.photos/seed/volu/800/600',
    trailerUrl: '',
    manifestUrl: `${PUBLIC_BASE}/manifests/${expId}.json`
  } as Experience;

  const jobs = store.listJobs();
  const exps = store.listExperiences();
  exps.push(exp);
  store.saveExperiences(exps);

  const job: Job = {
    id: jobId,
    experienceId: expId,
    title: exp.title,
    status: 'Queued',
    stage: 1,
    logs: ['Job created and queued for processing'],
    eta: '15 minutes'
  };
  jobs.unshift(job);
  store.saveJobs(jobs);

  // Seed manifest
  store.writeManifest(expId, {
    id: expId,
    devices: exp.devices,
    mrReady: exp.mrReady,
    defaultQuality: exp.defaultQuality,
    defaultInterpolation: exp.defaultInterpolation,
    assets: {
      splat: `gs://your-bucket/${expId}/model.splat`,
      poster: exp.posterUrl,
      trailer: exp.trailerUrl || ''
    }
  });

  // Enqueue stage 1
  await queue.add('pipeline', { jobId, stage: 1 });

  res.status(201).json(job);
});

// Analytics
app.get('/api/analytics/stats', (req, res)=>{
  res.json({
    dau: 1850, mau: 31000, mrUsagePct: 82,
    deviceBreakdown: [{device:'Android XR', value:60},{device:'Quest', value:30},{device:'Web', value:10}]
  });
});

app.listen(PORT, ()=> {
  console.log(`API listening on :${PORT}`);
  // Start worker in-process for simplicity
  createWorker(new URL(REDIS_URL));
});
