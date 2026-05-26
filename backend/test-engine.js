const diagnosisEngine = require('./src/prolog/diagnosis_engine');

async function test() {
    console.log('Waiting for Prolog to initialize...');
    
    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n=== Testing Medical Diagnosis Engine ===\n');
    
    // Test 1: Get all diseases
    console.log('1. Getting all diseases...');
    const diseases = await diagnosisEngine.getAllDiseases();
    console.log('Diseases:', diseases);
    console.log(`Found ${diseases.length} diseases\n`);
    
    // Test 2: Get symptoms for a specific disease
    console.log('2. Getting symptoms for Common Cold...');
    const coldSymptoms = await diagnosisEngine.getSymptoms('Common Cold');
    console.log('Common Cold symptoms:', coldSymptoms);
    console.log(`Found ${coldSymptoms.length} symptoms\n`);
    
    // Test 3: Get all symptoms
    console.log('3. Getting all symptoms...');
    const allSymptoms = await diagnosisEngine.getAllSymptoms();
    console.log('All symptoms:', allSymptoms);
    console.log(`Found ${allSymptoms.length} total symptoms\n`);
    
    // Test 4: Diagnose with some symptoms
    console.log('4. Diagnosing with symptoms: fever, cough, fatigue...');
    const testSymptoms = ['fever', 'cough', 'fatigue'];
    const diagnoses = await diagnosisEngine.diagnose(testSymptoms);
    console.log('Diagnoses:');
    diagnoses.forEach((diag, i) => {
        console.log(`  ${i + 1}. ${diag.disease} - ${diag.confidence.toFixed(1)}% confidence`);
    });
    console.log();
    
    // Test 5: Get treatment for top diagnosis
    if (diagnoses.length > 0) {
        console.log(`5. Getting treatment for ${diagnoses[0].disease}...`);
        const treatment = await diagnosisEngine.getTreatment(diagnoses[0].disease);
        console.log('Treatment:', treatment);
        console.log();
    }
    
    console.log('✅ All tests completed successfully!');
}

test().catch(console.error);