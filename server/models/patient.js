const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zipcode: String,
    contactNo: { type: String, unique: true, required: true },
    age: String,
    continueProgram: { type: Boolean, default: false },
    startDate: { type: Date, default: Date.now },
    /* startDate: {
        type: String,
        default: () => {
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const year = today.getFullYear();
            return `${month}/${day}/${year}`; // Returns 'MM/DD/YYYY'
        },
    }, */
    hidden: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Patient", patientSchema);
