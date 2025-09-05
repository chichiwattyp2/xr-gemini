# VoluSphere — Full Baseline Patch (Auth + Profile)

This patch adds:
- **Sign-in page** (`/auth/signin`) with demo roles
- **Profile page** (`/profile`) with editable name & avatar
- Header auth UI (Sign in / avatar + Sign out)
- AuthContext with `signIn`, `signOut`, `updateProfile` and localStorage persistence
- Routes wired in `App.tsx`

## Install
1. Replace files with the ones in this patch:
   - `contexts/AuthContext.tsx`
   - `components/Header.tsx`
   - `App.tsx`
2. Add new files:
   - `pages/auth/SignInPage.tsx`
   - `pages/user/ProfilePage.tsx`
3. **services/api.ts:** add this method inside the exported `api` object:
```ts
  authDelay: (): Promise<void> => new Promise(resolve => setTimeout(resolve, 300)),
```
4. Run:
```bash
npm run dev
```
Visit `#/auth/signin` and pick a role (Viewer/Creator/Admin) via the quick buttons.

## Notes on XR & Volumetric pipeline
- This baseline keeps XR launch via **Android deep link** on the Experience Detail page.
- Full on-device WebXR + Gaussian Splat rendering requires adding a WebGL/WebGPU viewer or native Android XR viewer. We left a clear hook to deep link manifests (`voluspherexr://open?expId=...`) and the pipeline UI simulates the 7 stages with progress.
