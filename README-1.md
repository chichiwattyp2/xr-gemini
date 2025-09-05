# VoluSphere Production Pack (Cloud Run friendly)

This pack gives you a backend API + job queue (BullMQ/Redis) + manifest serving for your volumetric pipeline.
It is tailored to deploy on **Google Cloud Run** (fits nicely with Google AI Studio). You can also run it locally.

## What’s inside
- `api/` — Node/Express + BullMQ workers (TypeScript)
- `openapi.yaml` — REST API contract
- `deploy/cloudrun/` — Cloud Run service YAML + quickstart
- `infra/docker-compose.yml` — local dev: API + Redis + MinIO
- `android/deeplink.md` — how the Android XR viewer consumes manifests

## Quick start (local)
```bash
# 1) Start API + Redis + MinIO
docker compose -f infra/docker-compose.yml up --build

# 2) Create a project (seeds job + manifest)
curl -X POST http://localhost:8080/api/projects -H "Content-Type: application/json" -d '{
  "title":"Room Capture A","description":"Demo","tags":["demo"],
  "privacy":"Public","devices":["Android XR"],
  "defaultQuality":"High","defaultInterpolation":"120fps"
}'

# 3) List jobs & experiences
curl http://localhost:8080/api/jobs
curl http://localhost:8080/api/experiences
# Manifest URL: http://localhost:8080/manifests/<expId>.json
```

## Frontend wiring (Google AI Studio / Vite)
Set an env var in your web app:
```
VITE_API_URL=http://localhost:8080/api
```
(or on Cloud Run, set it to your live API base). Update your `services/api.ts` to use `import.meta.env.VITE_API_URL`.

## Deploy to **Google Cloud Run**
1. **Create** a GCP project and enable: Cloud Run, Artifact Registry, Cloud Build, VPC, Memorystore (Redis) if needed.
2. **Build & push** container:
```bash
gcloud builds submit --tag us-central1-docker.pkg.dev/PROJECT_ID/volusphere/api:latest api
```
3. **Provision Redis** (Managed Memorystore) and note the host/port.
4. **Deploy** Cloud Run service:
```bash
gcloud run deploy volusphere-api   --image us-central1-docker.pkg.dev/PROJECT_ID/volusphere/api:latest   --region us-central1   --platform managed   --set-env-vars PORT=8080,REDIS_URL=redis://REDIS_HOST:6379,PUBLIC_BASE=https://YOUR_RUN_URL   --allow-unauthenticated
```
5. **Frontend**: set `VITE_API_URL=https://YOUR_RUN_URL/api` and redeploy the web app.

> For asset storage, swap MinIO with **Cloud Storage**. A simple replacement is to write manifests to local disk (already done) and upload assets to GCS buckets; update `manifestUrl` accordingly.

## Notes
- The worker runs **in-process** with the API in this pack for simplicity. For higher throughput, split workers into a separate service/pod.
- Replace the simulation in `api/src/queue.ts` with your real processing tools and write outputs to GCS/S3.
