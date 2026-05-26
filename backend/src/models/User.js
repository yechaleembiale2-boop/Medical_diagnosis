const mongoose = require('mongoose');

const diagnosisHistorySchema = new mongoose.Schema({
    symptoms: [String],
    diagnoses: [{
        disease: String,
        confidence: Number,
        treatment: String
    }],
    selectedDiagnosis: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    diagnosisHistory: [diagnosisHistorySchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);