const mongoose = require('mongoose');

const BankDetail = mongoose.model('BankDetail ', new mongoose.Schema({

    bank_name: {
        type: String,
        required: true
    },
    branch_name: {
        type: String,
        required: true
    },
    account_number: {
        type: String,
        required: true
    }
}));

module.exports = BankDetail;
