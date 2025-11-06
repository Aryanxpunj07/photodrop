import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: string, pass: string) => boolean;
  isSignup: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSubmit, isSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
        setUsername('');
        setPassword('');
        setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onSubmit(username, password);
    if (success) {
      onClose();
    } else {
      setError(isSignup ? 'Could not create account. Please try again.' : 'Invalid username or password.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isSignup ? "Create Admin Account" : "Admin Login"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            required
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
        >
          {isSignup ? 'Sign Up & Login' : 'Login'}
        </button>
      </form>
    </Modal>
  );
};

export default LoginModal;