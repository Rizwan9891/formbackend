const mongoose = require('mongoose');
const schema = mongoose.Schema;

const user = new schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: String, required: true },
    residentialAddress: {
        street1: { type: String },
        street2: { type: String },
    },
    permanentAddress: {
        street1: { type: String },
        street2: { type: String },
    },
    documents: [{
        name: { type: String },
        type: { type: String },
        url: { type: String },
    }],


}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('user', user);