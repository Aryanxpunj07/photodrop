
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { DownloadIcon } from './icons';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose }) => {
  const [pageUrl, setPageUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPageUrl(window.location.href);
    }
  }, [isOpen]);
  
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(pageUrl)}&color=ffffff&bgcolor=1e293b&qzone=1`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pageUrl);
    // You can add a toast notification here for better UX
  }

  const handleDownload = async () => {
    if (!pageUrl) return;
    setIsDownloading(true);
    try {
        const response = await fetch(qrApiUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PhotoDrop-QR.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to download QR code:", error);
    } finally {
        setIsDownloading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Gallery">
      <div className="flex flex-col items-center space-y-4">
        <p className="text-slate-400 text-center">Scan this QR code with your phone to open this page.</p>
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
            {pageUrl && <img src={qrApiUrl} alt="QR Code" width="256" height="256" />}
        </div>
        <div className="w-full p-2 bg-slate-700 rounded-md text-center text-sm text-cyan-300 overflow-x-auto">
          <code>{pageUrl}</code>
        </div>
         <button onClick={copyToClipboard} className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300">
            Copy URL
         </button>
         <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="w-full flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed">
            <DownloadIcon className="w-5 h-5" />
            <span>{isDownloading ? 'Downloading...' : 'Download QR'}</span>
         </button>
      </div>
    </Modal>
  );
};

export default QRModal;