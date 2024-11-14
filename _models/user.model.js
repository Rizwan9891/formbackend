const mongoose = require('mongoose');
const schema = mongoose.Schema;

const user = new schema({
    name: { type: String, default: "" },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    addressLine1: { type: String, default: "" },
    addressLine2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    pinCode: { type: String, default: "" },
    file: { type: String, default: "" },
},
    { timestamps: true, versionKey: false });

module.exports = mongoose.model('user', user);