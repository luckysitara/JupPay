const ApiKey = require('../models/apiKey');
const crypto = require('crypto');

exports.createApiKey = async (req, res) => {
    const { userId, type } = req.body;
    if (!['test', 'live'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid key type' });
    }
    try {
        const key = crypto.randomBytes(32).toString('hex');
        const apiKey = new ApiKey({ key, userId, type });
        await apiKey.save();
        res.status(201).json({ success: true, data: apiKey });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getApiKey = async (req, res) => {
    try {
        const apiKey = await ApiKey.findById(req.params.id);
        if (!apiKey) {
            return res.status(404).json({ success: false, message: 'API Key not found' });
        }
        res.json({ success: true, data: apiKey });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getAllApiKeys = async (req, res) => {
    try {
        const apiKeys = await ApiKey.find();
        res.json({ success: true, data: apiKeys });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteApiKey = async (req, res) => {
    try {
        const apiKey = await ApiKey.findByIdAndDelete(req.params.id);
        if (!apiKey) {
            return res.status(404).json({ success: false, message: 'API Key not found' });
        }
        res.json({ success: true, message: 'API Key deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};