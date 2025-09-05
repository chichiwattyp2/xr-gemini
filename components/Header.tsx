import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { NAV_LINKS } from '../constants';
import { Sun, Moon, LogIn, LogOut, Hexagon } from 'lucide-react';
import { UserRole } from '../types';
// FIX: Import the Button component.
import Button from './Button';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, signOut, isCreator } = useAuth();

  const activeLinkClass = 'text-primary-500 dark:text-primary-400 font-semibold';
  const inactiveLinkClass = 'hover:text-primary-500 dark:hover:text-primary-400 transition-colors';

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 focus-ring rounded-md">
              <Hexagon className="w-6 h-6 text-accent-blue" />
              <span className="font-bold text-lg text-white">VoluSphere</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4 ml-6 text-sm font-medium text-gray-300">
              {NAV_LINKS.public.map(link => {
                if (link.name === 'Creator' && !isCreator) return null;
                return (
                  <NavLink key={link.path} to={link.path}
                           className={({isActive}) => isActive ? activeLinkClass : inactiveLinkClass}>
                    {link.name}
                  </NavLink>
                )
              })}
              {isAuthenticated && NAV_LINKS.authenticated.map(link => (
                <NavLink key={link.path} to={link.path}
                         className={({isActive}) => isActive ? activeLinkClass : inactiveLinkClass}>
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-700 focus-ring" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-gray-300"/> : <Moon className="w-5 h-5 text-gray-300"/>}
            </button>

            {!isAuthenticated ? (
              <Link to="/auth/signin">
                 <Button variant="primary" size="sm" className="focus-ring bg-accent-blue text-black font-semibold hover:bg-sky-400">
                    <LogIn className="w-4 h-4 mr-2"/> Sign in
                  </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                {isCreator && (
                   <Link to="/creator/new">
                     <Button size="sm" className="hidden sm:inline-flex focus-ring bg-accent-blue text-black font-semibold hover:bg-sky-400">Start creating</Button>
                   </Link>
                )}
                <button onClick={()=>navigate('/profile')} className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-700 focus-ring">
                  <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                  <span className="hidden sm:inline font-semibold text-sm text-white">{user.name}</span>
                </button>
                <button onClick={()=>{signOut(); navigate('/');}} className="p-2 rounded-full hover:bg-gray-700 focus-ring" title="Sign out">
                  <LogOut className="w-5 h-5 text-gray-300"/>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
