import fs from 'fs';
import path from 'path';
import { Experience, Job } from './types.js';

const DATA = path.resolve(process.cwd(), 'data');
const EXP = path.join(DATA, 'experiences.json');
const JOB = path.join(DATA, 'jobs.json');
const MANIFESTS = path.join(DATA, 'manifests');

function ensure(){
  if(!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });
  if(!fs.existsSync(MANIFESTS)) fs.mkdirSync(MANIFESTS, { recursive: true });
  if(!fs.existsSync(EXP)) fs.writeFileSync(EXP, '[]');
  if(!fs.existsSync(JOB)) fs.writeFileSync(JOB, '[]');
}
ensure();

function readJSON<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, 'utf-8') || '[]');
}
function writeJSON<T>(p: string, v: T){
  fs.writeFileSync(p, JSON.stringify(v, null, 2));
}

export const store = {
  listExperiences(): Experience[] { return readJSON<Experience[]>(EXP); },
  saveExperiences(list: Experience[]){ writeJSON(EXP, list); },

  listJobs(): Job[] { return readJSON<Job[]>(JOB); },
  saveJobs(list: Job[]){ writeJSON(JOB, list); },

  manifestPath(id: string){ return path.join(MANIFESTS, `${id}.json`); },
  writeManifest(id: string, json: any){ fs.writeFileSync(store.manifestPath(id), JSON.stringify(json, null, 2)); },
  readManifest(id: string){ return JSON.parse(fs.readFileSync(store.manifestPath(id), 'utf-8')); }
};
