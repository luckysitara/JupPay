const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
    transactionPermission: { type: Boolean, default: false }
});

module.exports = mongoose.model('Role', roleSchema);