
import React, { useState, useEffect, useCallback } from 'react';
import type { Photo } from './types';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import QRModal from './components/QRModal';
import Upload from './components/Upload';
import Gallery from './components/Gallery';
import Countdown from './components/Countdown';

const PHOTO_LIFESPAN_MS = 24 * 60 * 60 * 1000;

const useAppStore = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [expirationDate, setExpirationDate] = useState<Date | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminExists, setAdminExists] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedPhotos = localStorage.getItem('photos');
            const storedExp = localStorage.getItem('expiration');

            if (storedPhotos && storedExp) {
                const expDate = new Date(JSON.parse(storedExp));
                if (expDate > new Date()) {
                    setPhotos(JSON.parse(storedPhotos));
                    setExpirationDate(expDate);
                } else {
                    // Clear expired data
                    localStorage.removeItem('photos');
                    localStorage.removeItem('expiration');
                    localStorage.removeItem('adminCredentials');
                }
            }

            // Check for admin credentials AFTER potentially clearing them
            const storedCreds = localStorage.getItem('adminCredentials');
            if (storedCreds) {
                setAdminExists(true);
            } else {
                setAdminExists(false);
            }

        } catch (error) {
            console.error("Failed to load from local storage:", error);
            // Clear corrupted storage
            localStorage.clear();
        }
        setIsLoading(false);
    }, []);

    const login = useCallback((user: string, pass: string): boolean => {
        const storedCreds = localStorage.getItem('adminCredentials');
        if (!storedCreds) return false;

        try {
            const { username, password } = JSON.parse(storedCreds);
            if (user === username && pass === password) {
                setIsAuthenticated(true);
                return true;
            }
        } catch (error) {
            console.error("Failed to parse admin credentials:", error);
        }
        return false;
    }, []);

    const signup = useCallback((user: string, pass: string): boolean => {
        if (localStorage.getItem('adminCredentials')) {
            console.error("Signup attempted, but admin already exists.");
            return false;
        }
        if (!user || !pass) return false;

        const credentials = { username: user, password: pass };
        try {
            localStorage.setItem('adminCredentials', JSON.stringify(credentials));
            setAdminExists(true);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error("Failed to save admin credentials:", error);
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
    }, []);

    const addPhotos = useCallback((newPhotos: Photo[]) => {
        const newExpDate = new Date(Date.now() + PHOTO_LIFESPAN_MS);
        setPhotos(prevPhotos => {
            const allPhotos = [...prevPhotos, ...newPhotos];
            try {
                localStorage.setItem('photos', JSON.stringify(allPhotos));
            } catch (e) {
                console.error("Could not save photos to local storage", e);
                // Consider showing an error to the user if storage is full
            }
            return allPhotos;
        });
        setExpirationDate(newExpDate);
        try {
            localStorage.setItem('expiration', JSON.stringify(newExpDate));
        } catch (e) {
            console.error("Could not save expiration date to local storage", e);
        }
    }, []);

    const clearPhotos = useCallback(() => {
        setPhotos([]);
        setExpirationDate(null);
        localStorage.removeItem('photos');
        localStorage.removeItem('expiration');
    }, []);

    return { photos, expirationDate, isAuthenticated, isLoading, login, logout, addPhotos, adminExists, signup, clearPhotos };
};


function App() {
    const { photos, expirationDate, isAuthenticated, isLoading, login, logout, addPhotos, adminExists, signup, clearPhotos } = useAppStore();
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isQrModalOpen, setQrModalOpen] = useState(false);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900">
            <Header
                isAuthenticated={isAuthenticated}
                hasPhotos={photos.length > 0}
                onLoginClick={() => setLoginModalOpen(true)}
                onLogoutClick={logout}
                onShareClick={() => setQrModalOpen(true)}
                adminExists={adminExists}
            />
            
            <main className="container mx-auto px-4 sm:px-8 py-8">
                {photos.length > 0 && <Countdown expirationDate={expirationDate} />}
                {isAuthenticated && <Upload onAddPhotos={addPhotos} onClear={clearPhotos} hasPhotos={photos.length > 0} />}
                <Gallery photos={photos} />
            </main>

            <footer className="text-center py-4 text-slate-500 text-sm">
                <p>Photos and admin account are deleted 24 hours after upload. All data is stored in your browser's local storage.</p>
            </footer>

            <LoginModal 
                isOpen={isLoginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onSubmit={adminExists ? login : signup}
                isSignup={!adminExists}
            />
            <QRModal 
                isOpen={isQrModalOpen}
                onClose={() => setQrModalOpen(false)}
            />
        </div>
    );
}

export default App;