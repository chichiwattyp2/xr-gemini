
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { NAV_LINKS, ALL_USER_ROLES } from '../constants';
import { UserRole } from '../types';
import { Sun, Moon, LogIn, UserCircle, Hexagon } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, setUserRole, isCreator, isAdmin } = useAuth();

  const activeLinkClass = 'text-primary-500 dark:text-primary-400 font-semibold';
  const inactiveLinkClass = 'hover:text-primary-500 dark:hover:text-primary-400 transition-colors';

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm dark:shadow-md dark:shadow-black/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary-600 dark:text-primary-400">
              <Hexagon size={28} />
              <span>VoluSphere</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {NAV_LINKS.public.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass)}
                >
                  {link.name}
                </NavLink>
              ))}
              {isCreator && NAV_LINKS.creator.map((link) => (
                 <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass)}
                >
                  {link.name}
                </NavLink>
              ))}
              {isAdmin && NAV_LINKS.admin.map((link) => (
                 <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass)}
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Role:</span>
              <select
                value={user.role}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {ALL_USER_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
             {user.role === UserRole.Visitor ? (
              <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
            ) : (
               <div className="flex items-center space-x-2">
                 <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                 <span className="hidden sm:inline font-medium">{user.name}</span>
               </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
