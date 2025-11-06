
import React, { useState } from 'react';
import { UploadIcon } from './icons';
import type { Photo } from '../types';

interface UploadProps {
  onAddPhotos: (photos: Photo[]) => void;
  onClear: () => void;
  hasPhotos: boolean;
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


const Upload: React.FC<UploadProps> = ({ onAddPhotos, onClear, hasPhotos }) => {
  const [previews, setPreviews] = useState<{name: string, url: string}[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileList = Array.from(files);
    setFilesToUpload(fileList);
    
    const newPreviews = await Promise.all(
        fileList.map(async (file) => ({
            name: file.name,
            url: await fileToDataUrl(file),
        }))
    );
    setPreviews(newPreviews);
  };

  const handleAddPhotosClick = async () => {
    if (filesToUpload.length === 0) return;
    setIsUploading(true);
    
    const photoData = await Promise.all(filesToUpload.map(async (file) => {
        const dataUrl = await fileToDataUrl(file);
        return {
            id: `${file.name}-${Date.now()}`,
            dataUrl,
            name: file.name,
        };
    }));
    
    onAddPhotos(photoData);
    setIsUploading(false);
    setPreviews([]);
    setFilesToUpload([]);
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="my-6 p-6 bg-slate-800 border border-slate-700 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Add Photos</h2>
      <p className="text-slate-400 mb-4 text-sm">You can select multiple files. Adding photos will reset the 24-hour expiration timer for the entire gallery.</p>
      
      <div className="relative border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500 transition-colors">
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <UploadIcon className="w-10 h-10 mx-auto text-slate-500 mb-2" />
        <p className="text-slate-400">Click or drag files here to upload</p>
      </div>
      
      {previews.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">{previews.length} file(s) selected:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-48 overflow-y-auto p-2 bg-slate-900 rounded-md">
            {previews.map((preview, index) => (
              <img key={index} src={preview.url} alt={preview.name} className="w-full h-20 object-cover rounded"/>
            ))}
          </div>
          <button
            onClick={handleAddPhotosClick}
            disabled={isUploading}
            className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : `Add ${filesToUpload.length} Photo(s)`}
          </button>
        </div>
      )}

      {hasPhotos && (
        <div className="mt-8 pt-6 border-t border-slate-700">
            <h3 className="text-lg font-bold text-red-400">Danger Zone</h3>
            <p className="text-slate-400 text-sm mt-1 mb-4">This action will permanently delete all photos in the gallery and cannot be undone.</p>
            <button
                onClick={onClear}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
            >
                Clear All Photos
            </button>
        </div>
      )}
    </div>
  );
};

export default Upload;