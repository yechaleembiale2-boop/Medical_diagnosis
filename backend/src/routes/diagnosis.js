const express = require('express');
const diagnosisEngine = require('../prolog/diagnosis_engine');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all possible symptoms
router.get('/symptoms', async (req, res) => {
    try {
        console.log('Fetching all symptoms...');
        const symptoms = await diagnosisEngine.getAllSymptoms();
        console.log(`Found ${symptoms.length} symptoms`);
        
        // Always return symptoms, even if empty
        res.json({ symptoms: symptoms.length > 0 ? symptoms : getDefaultSymptoms() });
    } catch (error) {
        console.error('Error fetching symptoms:', error);
        res.json({ symptoms: getDefaultSymptoms() });
    }
});

// Get all diseases
router.get('/diseases', async (req, res) => {
    try {
        const diseases = await diagnosisEngine.getAllDiseases();
        res.json({ diseases });
    } catch (error) {
        console.error('Error fetching diseases:', error);
        res.json({ diseases: getDefaultDiseases() });
    }
});

// Perform diagnosis
router.post('/diagnose', authMiddleware, async (req, res) => {
    try {
        const { symptoms } = req.body;
        
        console.log('Diagnosis request for symptoms:', symptoms);
        
        if (!symptoms || symptoms.length === 0) {
            return res.status(400).json({ error: 'Please provide at least one symptom' });
        }
        
        // Get diagnoses
        const diagnoses = await diagnosisEngine.diagnose(symptoms);
        console.log(`Found ${diagnoses.length} diagnoses`);
        
        // Get treatments for diagnoses
        const diagnosesWithTreatment = await Promise.all(
            diagnoses.map(async (diag) => {
                const treatment = await diagnosisEngine.getTreatment(diag.disease);
                return { 
                    disease: diag.disease, 
                    confidence: diag.confidence,
                    treatment: treatment 
                };
            })
        );
        
        // Save to user history
        try {
            const user = await User.findById(req.userId);
            if (user) {
                user.diagnosisHistory.push({
                    symptoms: symptoms,
                    diagnoses: diagnosesWithTreatment,
                    selectedDiagnosis: diagnosesWithTreatment[0]?.disease || null,
                    date: new Date()
                });
                await user.save();
                console.log('Diagnosis saved to user history');
            }
        } catch (dbError) {
            console.error('Error saving to history:', dbError);
        }
        
        res.json({
            diagnoses: diagnosesWithTreatment,
            message: 'Diagnosis completed successfully'
        });
    } catch (error) {
        console.error('Diagnosis error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's diagnosis history
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('diagnosisHistory');
        res.json({ history: user.diagnosisHistory || [] });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: error.message });
    }
});

// Save selected diagnosis
router.post('/select-diagnosis', authMiddleware, async (req, res) => {
    try {
        const { historyId, selectedDiagnosis } = req.body;
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const historyEntry = user.diagnosisHistory.id(historyId);
        if (historyEntry) {
            historyEntry.selectedDiagnosis = selectedDiagnosis;
            await user.save();
            res.json({ message: 'Diagnosis selected successfully' });
        } else {
            res.status(404).json({ error: 'History entry not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper functions
function getDefaultSymptoms() {
    return [
        'fever', 'cough', 'sore_throat', 'runny_nose', 'headache', 
        'fatigue', 'nausea', 'vomiting', 'diarrhea', 'sneezing', 
        'itchy_eyes', 'body_aches', 'chest_pain', 'shortness_breath', 
        'high_blood_pressure'
    ];
}

function getDefaultDiseases() {
    return [
        'Common Cold', 'Influenza', 'Strep Throat', 'Allergic Rhinitis',
        'Gastroenteritis', 'Migraine', 'Hypertension', 'Bronchitis'
    ];
}

module.exports = router;