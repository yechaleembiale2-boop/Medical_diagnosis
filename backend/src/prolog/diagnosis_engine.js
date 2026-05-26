// Medical Knowledge Base - JavaScript implementation (bypassing Prolog issues)
class DiagnosisEngine {
    constructor() {
        this.medicalData = {
            diseases: [
                'Common Cold',
                'Influenza', 
                'Strep Throat',
                'Allergic Rhinitis',
                'Gastroenteritis',
                'Migraine',
                'Hypertension',
                'Bronchitis'
            ],
            
            symptoms: {
                'Common Cold': ['fever', 'cough', 'runny_nose', 'fatigue', 'sore_throat'],
                'Influenza': ['fever', 'cough', 'body_aches', 'fatigue', 'headache', 'sore_throat'],
                'Strep Throat': ['sore_throat', 'fever', 'headache', 'fatigue'],
                'Allergic Rhinitis': ['sneezing', 'runny_nose', 'itchy_eyes', 'fatigue'],
                'Gastroenteritis': ['nausea', 'vomiting', 'diarrhea', 'fever', 'fatigue'],
                'Migraine': ['headache', 'nausea', 'fatigue'],
                'Hypertension': ['high_blood_pressure', 'headache', 'fatigue'],
                'Bronchitis': ['cough', 'shortness_breath', 'fatigue', 'chest_pain']
            },
            
            treatments: {
                'Common Cold': 'Rest, drink plenty of fluids, over-the-counter cold medications (like paracetamol or ibuprofen for fever)',
                'Influenza': 'Rest, hydration, antiviral medications if severe (within 48 hours of symptoms), fever reducers',
                'Strep Throat': 'Antibiotics (amoxicillin or penicillin prescribed by doctor), rest, warm salt water gargles, throat lozenges',
                'Allergic Rhinitis': 'Antihistamines (like cetirizine or loratadine), nasal corticosteroids, avoid known allergens',
                'Gastroenteritis': 'Hydration (oral rehydration solution), BRAT diet (bananas, rice, applesauce, toast), rest, avoid dairy',
                'Migraine': 'Rest in dark quiet room, pain relievers (ibuprofen), prescription migraine medications (triptans), cold compress',
                'Hypertension': 'Lifestyle changes (diet, exercise), reduce sodium intake, blood pressure medications as prescribed',
                'Bronchitis': 'Rest, hydration, cough suppressants, humidifier, inhaler if wheezing, avoid smoke/irritants'
            }
        };
        
        console.log('✅ Medical Knowledge Base initialized with JavaScript');
    }

    async getAllDiseases() {
        return this.medicalData.diseases;
    }

    async getSymptoms(disease) {
        return this.medicalData.symptoms[disease] || [];
    }

    async getAllSymptoms() {
        const allSymptoms = new Set();
        for (const disease of this.medicalData.diseases) {
            const symptoms = this.medicalData.symptoms[disease];
            symptoms.forEach(s => allSymptoms.add(s));
        }
        return Array.from(allSymptoms);
    }

    async diagnose(symptoms) {
        console.log(`Diagnosing symptoms: ${symptoms}`);
        
        if (!symptoms || symptoms.length === 0) {
            return [];
        }
        
        const diagnoses = [];
        
        // Calculate confidence for each disease
        for (const disease of this.medicalData.diseases) {
            const diseaseSymptoms = this.medicalData.symptoms[disease];
            let matchCount = 0;
            
            // Count matching symptoms
            for (const symptom of symptoms) {
                if (diseaseSymptoms.includes(symptom)) {
                    matchCount++;
                }
            }
            
            // Calculate confidence percentage
            const confidence = (matchCount / diseaseSymptoms.length) * 100;
            
            // Only include if there's at least one matching symptom
            if (matchCount > 0) {
                diagnoses.push({
                    disease: disease,
                    confidence: Math.min(confidence, 100), // Cap at 100%
                    matchedSymptoms: matchCount,
                    totalSymptoms: diseaseSymptoms.length
                });
            }
        }
        
        // Sort by confidence (highest first)
        diagnoses.sort((a, b) => b.confidence - a.confidence);
        
        console.log(`Found ${diagnoses.length} possible diagnoses`);
        return diagnoses;
    }

    async getTreatment(disease) {
        return this.medicalData.treatments[disease] || 'Please consult a healthcare professional for treatment options.';
    }
}

// Create a singleton instance
const engine = new DiagnosisEngine();

module.exports = engine;