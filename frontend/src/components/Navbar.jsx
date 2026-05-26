import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <i className="fas fa-heartbeat text-medical-500 text-2xl"></i>
            <span className="font-bold text-xl bg-gradient-to-r from-medical-500 to-medical-700 bg-clip-text text-transparent">
              MediExpert
            </span>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-6">
              <Link to="/diagnosis" className="text-gray-600 hover:text-medical-500 transition-colors flex items-center space-x-1">
                <i className="fas fa-stethoscope"></i>
                <span>Diagnosis</span>
              </Link>
              <Link to="/history" className="text-gray-600 hover:text-medical-500 transition-colors flex items-center space-x-1">
                <i className="fas fa-history"></i>
                <span>History</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-medical-50 px-3 py-1 rounded-full">
                  <i className="fas fa-user-circle text-medical-500"></i>
                  <span className="text-gray-700 font-medium">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-medical-500 transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-medical-500 text-white px-4 py-2 rounded-lg hover:bg-medical-600 transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;