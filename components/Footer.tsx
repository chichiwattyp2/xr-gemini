
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} VoluSphere XR. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/creator-guide" className="text-sm hover:underline">Creator Guide</Link>
            <Link to="/pricing" className="text-sm hover:underline">Pricing</Link>
            <Link to="#" className="text-sm hover:underline">Terms of Service</Link>
            <Link to="#" className="text-sm hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
