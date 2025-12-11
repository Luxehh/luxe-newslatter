const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
newsletterSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Update the updatedAt field before updating
newsletterSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

module.exports = mongoose.model("Newsletter", newsletterSchema);
