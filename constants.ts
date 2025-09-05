
import { UserRole } from './types';

export const NAV_LINKS = {
  public: [
    { name: 'Explore', path: '/explore' },
    { name: 'Tech Demos', path: '/tech-demos' },
    { name: 'Creator Guide', path: '/creator-guide' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Viewer Spec', path: '/viewer-spec' },
  ],
  creator: [
    { name: 'Dashboard', path: '/creator/dashboard' },
    { name: 'New Project', path: '/creator/new' },
  ],
  admin: [
    { name: 'Admin Console', path: '/admin' },
  ],
};

export const ALL_USER_ROLES = [
  UserRole.Visitor,
  UserRole.Viewer,
  UserRole.Creator,
  UserRole.Admin,
];
