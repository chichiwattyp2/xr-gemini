import { Queue, Worker } from 'bullmq';
import { RedisOptions } from 'ioredis';
import { store } from './storage.js';
import { Job as VJob } from './types.js';

const QUEUE_NAME = 'volusphere';
export type PipelineJob = { jobId: string; stage: number };

export function createQueue(redis: RedisOptions){
  const queue = new Queue<PipelineJob>(QUEUE_NAME, { connection: redis });
  return { queue };
}

export function createWorker(redis: RedisOptions){
  const worker = new Worker<PipelineJob>(QUEUE_NAME, async (job) => {
    const { jobId, stage } = job.data;
    // Simulate work + progress
    for (let p=0; p<=100; p+=20){
      await new Promise(r=>setTimeout(r, 350));
      await job.updateProgress(p);
    }
    // Update persisted job
    const jobs = store.listJobs();
    const j = jobs.find(j => j.id === jobId);
    if (j){
      if (stage < 7){
        j.stage = (stage + 1) as VJob['stage'];
        j.status = 'Running';
        j.logs.push(`Stage ${stage} complete → enqueued stage ${stage+1}`);
        store.saveJobs(jobs);
        // Enqueue next stage
        await job.queue.add('pipeline', { jobId, stage: stage+1 });
      } else {
        j.status = 'Success';
        j.logs.push('Pipeline complete');
        store.saveJobs(jobs);
      }
    }
  }, { connection: redis });
  return worker;
}
