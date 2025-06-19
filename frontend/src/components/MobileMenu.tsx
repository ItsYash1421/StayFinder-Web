import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
      <div className="bg-white h-full w-64 p-4">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="text-2xl font-bold text-blue-600" onClick={onClose}>
            StayFinder
          </Link>
          <button onClick={onClose} className="text-gray-600">
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <nav className="space-y-4">
          <Link
            to="/"
            className="block text-gray-600 hover:text-blue-600"
            onClick={onClose}
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/bookings"
                className="block text-gray-600 hover:text-blue-600"
                onClick={onClose}
              >
                My Bookings
              </Link>
              {user.role === 'host' && (
                <Link
                  to="/host/dashboard"
                  className="block text-gray-600 hover:text-blue-600"
                  onClick={onClose}
                >
                  Host Dashboard
                </Link>
              )}
              <Link
                to="/profile"
                className="block text-gray-600 hover:text-blue-600"
                onClick={onClose}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="block w-full text-left text-gray-600 hover:text-blue-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-gray-600 hover:text-blue-600"
                onClick={onClose}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-gray-600 hover:text-blue-600"
                onClick={onClose}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu; 