import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg text-center">
          <h2 className="text-3xl font-bold text-blue-700">Please log in to view your profile</h2>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 inline-flex items-center px-5 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 px-8 py-10 relative">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-10">
          <div className="relative self-center md:self-auto">
            {(user.avatar || user.profilePicture) ? (
              <img
                src={user.avatar || user.profilePicture}
                alt="Avatar"
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-200 shadow-lg transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center rounded-full bg-blue-200 text-blue-800 text-5xl font-bold border-4 border-blue-200 shadow-lg">
                {user.name ? user.name[0] : 'U'}
              </div>
            )}
            <span className="absolute bottom-2 right-2 bg-green-400 border-2 border-white w-5 h-5 rounded-full flex items-center justify-center animate-pulse"></span>
          </div>
          <div className="flex-1 mt-6 md:mt-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-semibold uppercase tracking-wide border border-blue-200">
                {user.role === 'host' ? 'Host' : 'Guest'}
              </span>
            </div>
            <p className="text-gray-500 mt-2 flex items-center">
              <span className="material-icons text-blue-400 mr-1">mail</span>
              <span className="font-medium">{user.email}</span>
            </p>
            {user.phone && (
              <p className="text-gray-500 mt-1 flex items-center">
                <span className="material-icons text-blue-400 mr-1">phone</span>
                <span>{user.phone}</span>
              </p>
            )}
            <p className="text-gray-500 mt-1 flex items-center">
              <span className="material-icons text-blue-400 mr-1">calendar_today</span>
              Joined: <span className="ml-1">{new Date(user.createdAt).toLocaleDateString()}</span>
            </p>
            <div className="mt-4">
              <label className="text-xs uppercase font-semibold text-gray-400">User ID</label>
              <div className="font-mono text-sm text-gray-700 bg-gray-100 rounded-lg px-2 py-1 break-all">{user._id}</div>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                className="px-6 py-2 rounded-full bg-gray-100 text-gray-700 font-bold shadow hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={() => navigate('/bookings')}
              >
                My Bookings
              </button>
            </div>
          </div>
        </div>
        {user.bio && (
          <div className="mt-10 p-6 rounded-xl bg-blue-50 border-l-4 border-blue-400 shadow-md animate-fade-in">
            <h2 className="text-xl text-blue-700 font-semibold mb-1">About</h2>
            <p className="text-gray-700 leading-relaxed">{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 