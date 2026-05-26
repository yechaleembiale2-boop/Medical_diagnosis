% Disease facts
disease('Common Cold').
disease('Influenza').
disease('Strep Throat').
disease('Allergic Rhinitis').
disease('Gastroenteritis').
disease('Migraine').
disease('Hypertension').
disease('Bronchitis').

% Symptoms
symptom('fever').
symptom('cough').
symptom('sore_throat').
symptom('runny_nose').
symptom('headache').
symptom('fatigue').
symptom('nausea').
symptom('vomiting').
symptom('diarrhea').
symptom('sneezing').
symptom('itchy_eyes').
symptom('body_aches').
symptom('chest_pain').
symptom('shortness_breath').
symptom('high_blood_pressure').

% Disease-symptom relationships
symptom_of('fever', 'Common Cold').
symptom_of('cough', 'Common Cold').
symptom_of('runny_nose', 'Common Cold').
symptom_of('fatigue', 'Common Cold').

symptom_of('fever', 'Influenza').
symptom_of('cough', 'Influenza').
symptom_of('body_aches', 'Influenza').
symptom_of('fatigue', 'Influenza').
symptom_of('headache', 'Influenza').

symptom_of('sore_throat', 'Strep Throat').
symptom_of('fever', 'Strep Throat').
symptom_of('headache', 'Strep Throat').

symptom_of('sneezing', 'Allergic Rhinitis').
symptom_of('runny_nose', 'Allergic Rhinitis').
symptom_of('itchy_eyes', 'Allergic Rhinitis').

symptom_of('nausea', 'Gastroenteritis').
symptom_of('vomiting', 'Gastroenteritis').
symptom_of('diarrhea', 'Gastroenteritis').
symptom_of('fever', 'Gastroenteritis').

symptom_of('headache', 'Migraine').
symptom_of('nausea', 'Migraine').

symptom_of('high_blood_pressure', 'Hypertension').
symptom_of('headache', 'Hypertension').

symptom_of('cough', 'Bronchitis').
symptom_of('shortness_breath', 'Bronchitis').
symptom_of('fatigue', 'Bronchitis').
symptom_of('chest_pain', 'Bronchitis').

% Treatment facts
treatment('Common Cold', 'Rest, drink plenty of fluids, over-the-counter cold medications').
treatment('Influenza', 'Rest, hydration, antiviral medications if severe, fever reducers').
treatment('Strep Throat', 'Antibiotics (amoxicillin or penicillin), rest, warm salt water gargles').
treatment('Allergic Rhinitis', 'Antihistamines, nasal corticosteroids, avoid allergens').
treatment('Gastroenteritis', 'Hydration, BRAT diet (bananas, rice, applesauce, toast), rest').
treatment('Migraine', 'Rest in dark room, pain relievers, prescription migraine medications').
treatment('Hypertension', 'Lifestyle changes, blood pressure medications, reduce sodium intake').
treatment('Bronchitis', 'Rest, hydration, cough suppressants, inhaler if wheezing').

% Diagnosis rules
diagnose(Disease, Symptoms) :-
    disease(Disease),
    is_disease_match(Disease, Symptoms, 0.6).

is_disease_match(Disease, Symptoms, Threshold) :-
    findall(Symptom, (member(Symptom, Symptoms), symptom_of(Symptom, Disease)), MatchedSymptoms),
    length(MatchedSymptoms, MatchCount),
    length(Symptoms, TotalSymptoms),
    TotalSymptoms > 0,
    MatchCount / TotalSymptoms >= Threshold.

get_confidence(Disease, Symptoms, Confidence) :-
    findall(Symptom, (member(Symptom, Symptoms), symptom_of(Symptom, Disease)), MatchedSymptoms),
    length(MatchedSymptoms, MatchCount),
    length(Symptoms, TotalSymptoms),
    TotalSymptoms > 0,
    Confidence is MatchCount / TotalSymptoms.

% Get all possible diagnoses with confidence
all_diagnoses(Symptoms, Diagnoses) :-
    findall(Disease-Confidence, 
           (disease(Disease), 
            get_confidence(Disease, Symptoms, Confidence),
            Confidence > 0),
           Unsorted),
    sort(1, @>=, Unsorted, Diagnoses).