const mongoose = require("mongoose");

const newsletterTemplateSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        required: true,
        unique: true,
        min: 1,
        max: 12
    },
    templateLink: {
        type: String,
        required: true,
        trim: true
    },
    fileName: {
        type: String,
        trim: true,
        default: ""
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
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
newsletterTemplateSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Update the updatedAt field before updating
newsletterTemplateSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

module.exports = mongoose.model("NewsletterTemplate", newsletterTemplateSchema);
