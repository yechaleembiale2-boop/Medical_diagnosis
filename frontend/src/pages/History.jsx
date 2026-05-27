import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Get API URL from environment variable or use localhost as fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEntry, setExpandedEntry] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/history`);
      setHistory(response.data.history);
    } catch (error) {
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`${API_URL}/api/history/${id}`);
        toast.success('Entry deleted');
        fetchHistory();
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  const clearAllHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      try {
        await axios.delete(`${API_URL}/api/history`);
        toast.success('All history cleared');
        fetchHistory();
      } catch (error) {
        toast.error('Failed to clear history');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader border-4 border-medical-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Diagnosis History</h1>
            <p className="text-gray-600">View your past medical consultations</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
            >
              <i className="fas fa-trash-alt mr-2"></i>
              Clear All
            </button>
          )}
        </div>
        
        {history.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <i className="fas fa-history text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No History Yet</h3>
            <p className="text-gray-400">Your diagnosis history will appear here</p>
            <Link to="/diagnosis" className="inline-block mt-4 bg-medical-500 text-white px-6 py-2 rounded-lg hover:bg-medical-600">
              Start New Diagnosis
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => (
              <div key={entry._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedEntry(expandedEntry === entry._id ? null : entry._id)}>
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      <div className="font-semibold text-gray-800 mt-1">
                        Symptoms: {entry.symptoms.map(s => s.replace(/_/g, ' ')).join(', ')}
                      </div>
                      {entry.selectedDiagnosis && (
                        <div className="text-sm text-medical-600 mt-1">
                          Selected: {entry.selectedDiagnosis}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEntry(entry._id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                      <i className={`fas fa-chevron-${expandedEntry === entry._id ? 'up' : 'down'} text-gray-400`}></i>
                    </div>
                  </div>
                </div>
                
                {expandedEntry === entry._id && (
                  <div className="border-t p-4 bg-gray-50">
                    <h4 className="font-semibold mb-3">Detailed Diagnoses:</h4>
                    <div className="space-y-3">
                      {entry.diagnoses.map((diagnosis, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-gray-800">{diagnosis.disease}</span>
                            <span className="text-sm font-semibold text-medical-600">
                              {diagnosis.confidence.toFixed(1)}% confidence
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{diagnosis.treatment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
