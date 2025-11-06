import React from 'react';
import { QrCodeIcon } from './icons';

interface HeaderProps {
  isAuthenticated: boolean;
  hasPhotos: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onShareClick: () => void;
  adminExists: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, hasPhotos, onLoginClick, onLogoutClick, onShareClick, adminExists }) => {
  return (
    <header className="py-4 px-4 sm:px-8 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-800">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Photo<span className="text-cyan-400">Drop</span>
        </h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {hasPhotos && (
            <button
              onClick={onShareClick}
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
            >
              <QrCodeIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}
          {isAuthenticated ? (
            <button
              onClick={onLogoutClick}
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
            >
              {adminExists ? 'Admin' : 'Create Account'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;