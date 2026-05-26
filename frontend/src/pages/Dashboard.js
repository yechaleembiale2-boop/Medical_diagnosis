import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-medical-500 to-medical-700 px-8 py-12 text-white text-center">
            <i className="fas fa-heartbeat text-6xl mb-4"></i>
            <h1 className="text-4xl font-bold mb-2">Welcome, {user?.username}!</h1>
            <p className="text-medical-100">Your AI-Powered Medical Diagnosis Assistant</p>
          </div>
          
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Link to="/diagnosis" className="block">
                <div className="border-2 border-medical-200 rounded-xl p-6 text-center hover:border-medical-500 transition-all hover:shadow-lg">
                  <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-stethoscope text-2xl text-medical-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">New Diagnosis</h3>
                  <p className="text-gray-600 text-sm">Check your symptoms and get instant AI diagnosis</p>
                </div>
              </Link>
              
              <Link to="/history" className="block">
                <div className="border-2 border-purple-200 rounded-xl p-6 text-center hover:border-purple-500 transition-all hover:shadow-lg">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-history text-2xl text-purple-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Diagnosis History</h3>
                  <p className="text-gray-600 text-sm">View all your previous medical consultations</p>
                </div>
              </Link>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex items-start">
                <i className="fas fa-info-circle text-yellow-400 mt-0.5 mr-3"></i>
                <div>
                  <p className="text-sm text-yellow-700 font-medium">Medical Disclaimer</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    This is an educational demonstration system. Always consult qualified healthcare professionals 
                    for medical advice, diagnosis, or treatment. Never disregard professional medical advice based on 
                    information from this system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;