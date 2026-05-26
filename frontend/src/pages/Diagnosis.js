import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Diagnosis = () => {
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosing, setDiagnosing] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      setLoading(true);
      console.log('Fetching symptoms from backend...');
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      const response = await axios.get('http://localhost:5000/api/diagnosis/symptoms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Symptoms response:', response.data);
      
      if (response.data && response.data.symptoms) {
        setAvailableSymptoms(response.data.symptoms);
      } else {
        // Fallback symptoms if backend doesn't return any
        const fallbackSymptoms = [
          'fever', 'cough', 'sore_throat', 'runny_nose', 'headache', 
          'fatigue', 'nausea', 'vomiting', 'diarrhea', 'sneezing', 
          'itchy_eyes', 'body_aches', 'chest_pain', 'shortness_breath', 
          'high_blood_pressure'
        ];
        setAvailableSymptoms(fallbackSymptoms);
        console.log('Using fallback symptoms');
      }
    } catch (error) {
      console.error('Failed to fetch symptoms:', error);
      // Set fallback symptoms
      const fallbackSymptoms = [
        'fever', 'cough', 'sore_throat', 'runny_nose', 'headache', 
        'fatigue', 'nausea', 'vomiting', 'diarrhea', 'sneezing', 
        'itchy_eyes', 'body_aches', 'chest_pain', 'shortness_breath', 
        'high_blood_pressure'
      ];
      setAvailableSymptoms(fallbackSymptoms);
      toast.error('Using default symptoms. Backend may not be fully connected.');
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomToggle = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleDiagnose = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom');
      return;
    }

    setDiagnosing(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Sending diagnosis request with symptoms:', selectedSymptoms);
      
      const response = await axios.post('http://localhost:5000/api/diagnosis/diagnose', {
        symptoms: selectedSymptoms
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Diagnosis response:', response.data);
      setResults(response.data.diagnoses);
      toast.success('Diagnosis completed successfully!');
    } catch (error) {
      console.error('Diagnosis failed:', error);
      toast.error(error.response?.data?.error || 'Diagnosis failed');
      
      // For demo purposes, show mock results if backend fails
      const mockResults = [
        {
          disease: 'Common Cold',
          confidence: 75,
          treatment: 'Rest, drink plenty of fluids, over-the-counter cold medications'
        },
        {
          disease: 'Influenza',
          confidence: 45,
          treatment: 'Rest, hydration, antiviral medications if severe, fever reducers'
        }
      ];
      setResults(mockResults);
      toast.info('Showing demo results. Connect backend for real diagnosis.');
    } finally {
      setDiagnosing(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return 'text-green-600';
    if (confidence >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="loader border-4 border-medical-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading symptoms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Medical Diagnosis</h1>
          <p className="text-gray-600">Select your symptoms for an intelligent AI diagnosis</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Symptoms Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <i className="fas fa-stethoscope mr-2 text-medical-500"></i>
              Select Symptoms
            </h2>
            
            {availableSymptoms.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <i className="fas fa-exclamation-circle text-4xl mb-2"></i>
                <p>No symptoms available</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 mb-6 max-h-96 overflow-y-auto">
                  {availableSymptoms.map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-medical-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {symptom.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Selected Symptoms:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map(symptom => (
                        <span key={symptom} className="px-2 py-1 bg-medical-100 text-medical-700 rounded-full text-sm flex items-center">
                          <i className="fas fa-check-circle text-xs mr-1"></i>
                          {symptom.replace(/_/g, ' ')}
                          <button
                            onClick={() => handleSymptomToggle(symptom)}
                            className="ml-1 text-medical-500 hover:text-medical-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {selectedSymptoms.length === 0 && (
                        <span className="text-gray-400 text-sm">No symptoms selected</span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleDiagnose}
                    disabled={diagnosing || selectedSymptoms.length === 0}
                    className="w-full bg-gradient-to-r from-medical-500 to-medical-600 text-white py-3 rounded-lg font-semibold hover:from-medical-600 hover:to-medical-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {diagnosing ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Analyzing Symptoms...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-microscope mr-2"></i>
                        Start AI Diagnosis
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* Results Display */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <i className="fas fa-chart-line mr-2 text-medical-500"></i>
              Diagnosis Results
            </h2>
            {results && results.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{result.disease}</h3>
                      <span className={`font-bold ${getConfidenceColor(result.confidence)}`}>
                        {result.confidence.toFixed(1)}% match
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-medical-500 rounded-full h-2 transition-all duration-500"
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-700 mb-1 flex items-center">
                        <i className="fas fa-prescription-bottle mr-1 text-medical-500"></i>
                        Recommended Treatment:
                      </h4>
                      <p className="text-gray-600 text-sm">{result.treatment}</p>
                    </div>
                    {index === 0 && (
                      <div className="mt-3 pt-2 border-t">
                        <div className="flex items-center text-green-600 text-sm">
                          <i className="fas fa-check-circle mr-1"></i>
                          <span>Most likely diagnosis based on your symptoms</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <i className="fas fa-search text-5xl mb-3"></i>
                <p>Select symptoms and start diagnosis to see results</p>
                <p className="text-xs mt-2 text-gray-300">Example: Select "fever", "cough", and "fatigue" then click Start</p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
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
  );
};

export default Diagnosis;