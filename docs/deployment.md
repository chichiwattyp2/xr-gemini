# Deployment Guide

This document provides guidance for deploying the VoluSphere XR Platform backend and web application.

## 1. Environment Variables

The application relies on several environment variables for configuration. Create a `.env.local` file for local development.

```sh
# Google Gemini API Key
# Required for AI-powered content generation (descriptions, tags).
API_KEY="your-google-ai-studio-api-key"

# Database Connection (Example for PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication Service
# Secret key for signing JWTs or session cookies.
AUTH_SECRET="a-very-strong-and-secret-key"

# Job Queue (Example for Redis)
REDIS_URL="redis://localhost:6379"

# S3-Compatible Storage
S3_ENDPOINT="https://your-s3-endpoint.com"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"
S3_BUCKET_NAME="volusphere-assets"

# CDN Public URL
CDN_URL="https://cdn.your-domain.com"

# Stripe Integration for Billing
# Keys for processing payments and managing subscriptions.
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 2. Storage & CDN

-   **Storage**: An S3-compatible object storage service is required for storing raw uploads and processed experience assets.
-   **CDN**: A Content Delivery Network (CDN) should be configured to sit in front of the S3 bucket. This ensures low-latency delivery of large volumetric assets to users worldwide.
-   **Signed URLs**: For private and unlisted content, the backend must be configured to generate signed URLs for CDN assets. This restricts access to authorized users only.
-   **CORS Policy**: The storage bucket and CDN must have a proper Cross-Origin Resource Sharing (CORS) policy to allow the web application to fetch assets (like manifests and preview images).

## 3. Billing (Stripe Integration)

-   The platform is designed for metered billing (per processing minute, per GB storage) using Stripe.
-   Set up products and prices in your Stripe dashboard for the "Creator" and "Team" plans.
-   Configure a webhook endpoint in the backend to listen for Stripe events (e.g., `invoice.paid`, `customer.subscription.deleted`) to update user entitlements.
-   The `STRIPE_WEBHOOK_SECRET` is crucial for securing this endpoint.

## 4. Pipeline Workers

-   The processing pipeline stages (reconstruction, baking, etc.) are executed by background workers.
-   These workers should be deployed as separate, scalable services (e.g., in Docker containers managed by Kubernetes or a similar orchestrator).
-   They connect to the job queue (Redis) to pick up new tasks.
-   Ensure workers have sufficient CPU, GPU (for reconstruction), and memory resources.
