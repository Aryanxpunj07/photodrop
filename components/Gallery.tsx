
import React from 'react';
import type { Photo } from '../types';
import { DownloadIcon } from './icons';

interface GalleryProps {
  photos: Photo[];
}

const PhotoCard: React.FC<{ photo: Photo }> = ({ photo }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1 bg-slate-800">
      <img src={photo.dataUrl} alt={photo.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
        <a
          href={photo.dataUrl}
          download={photo.name}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Download</span>
        </a>
      </div>
    </div>
  );
};

const Gallery: React.FC<GalleryProps> = ({ photos }) => {
  if (photos.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-300">No photos yet.</h2>
        <p className="text-slate-500 mt-2">The admin can log in to upload photos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {photos.map(photo => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
};

export default Gallery;
