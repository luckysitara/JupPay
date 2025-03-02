const Transaction = require('../models/Transaction');
const ApiKey = require('../models/apiKey');

exports.createTransaction = async (req, res) => {
    const { amount, userId, apiKey } = req.body;
    try {
        const key = await ApiKey.findOne({ key: apiKey });
        if (!key) {
            return res.status(400).json({ success: false, message: 'Invalid API Key' });
        }
        if (key.type === 'test') {
            return res.status(201).json({ success: true, message: 'Test transaction created', data: { amount, userId, status: 'test' } });
        }
        const transaction = new Transaction({ amount, userId });
        await transaction.save();
        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        res.json({ success: true, data: transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json({ success: true, data: transactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        res.json({ success: true, data: transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        res.json({ success: true, message: 'Transaction deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};