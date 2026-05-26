const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get user's diagnosis history
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('diagnosisHistory');
        res.json({ history: user?.diagnosisHistory || [] });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get specific diagnosis entry
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const historyEntry = user?.diagnosisHistory?.id(req.params.id);
        
        if (!historyEntry) {
            return res.status(404).json({ error: 'History entry not found' });
        }
        
        res.json({ entry: historyEntry });
    } catch (error) {
        console.error('Error fetching history entry:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete history entry
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const historyEntry = user.diagnosisHistory.id(req.params.id);
        if (historyEntry) {
            historyEntry.deleteOne();
            await user.save();
            res.json({ message: 'History entry deleted successfully' });
        } else {
            res.status(404).json({ error: 'History entry not found' });
        }
    } catch (error) {
        console.error('Error deleting history entry:', error);
        res.status(500).json({ error: error.message });
    }
});

// Clear all history
router.delete('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (user) {
            user.diagnosisHistory = [];
            await user.save();
            res.json({ message: 'All history cleared successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;