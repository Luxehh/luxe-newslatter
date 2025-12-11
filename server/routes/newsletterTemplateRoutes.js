const express = require("express");
const NewsletterTemplate = require("../models/newsletterTemplate");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Helper function to delete file from server
const deleteFile = (filePath) => {
    try {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`File deleted: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
        return false;
    }
};

// Helper function to extract filename from URL
const getFilePathFromUrl = (url) => {
    if (!url) return null;
    try {
        // Extract filename from URL like: http://localhost:3000/uploads/newsletters/newsletter-123.pdf
        const urlParts = url.split('/uploads/newsletters/');
        if (urlParts.length > 1) {
            const filename = urlParts[1];
            return path.join(__dirname, "../uploads/newsletters", filename);
        }
        return null;
    } catch (error) {
        console.error(`Error extracting filepath: ${error.message}`);
        return null;
    }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads/newsletters");
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, "newsletter-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only PDF and DOC files are allowed!"));
        }
    }
});

// ✅ Upload Newsletter Template File
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Generate URL for the uploaded file
        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/newsletters/${req.file.filename}`;

        res.status(200).json({
            message: "File uploaded successfully",
            fileName: req.file.originalname,
            filePath: req.file.filename,
            fileUrl: fileUrl
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Add Newsletter Template
router.post("/add", async (req, res) => {
    try {
        const { orderNumber, templateLink, fileName, title, description, isActive } = req.body;

        // Check for existing template with the same order number
        const existingTemplate = await NewsletterTemplate.findOne({ orderNumber });
        if (existingTemplate) {
            return res.status(200).json({ 
                message: `Template for Order ${orderNumber} already exists. Please update instead.`,
                template: existingTemplate
            });
        }

        const template = new NewsletterTemplate({
            orderNumber,
            templateLink,
            fileName: fileName || "",
            title,
            description: description || "",
            isActive: isActive !== undefined ? isActive : true
        });

        await template.save();

        res.status(201).json({
            message: "Newsletter template created successfully",
            template
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Update Newsletter Template
router.post("/update", async (req, res) => {
    try {
        const { id, orderNumber, templateLink, fileName, title, description, isActive } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Template ID is required" });
        }

        // Get existing template to check for old file
        const existingTemplate = await NewsletterTemplate.findById(id);
        if (!existingTemplate) {
            return res.status(404).json({ message: "Template not found" });
        }

        // Check if another template already has this order number
        if (orderNumber) {
            const duplicateTemplate = await NewsletterTemplate.findOne({
                orderNumber,
                _id: { $ne: id }
            });

            if (duplicateTemplate) {
                return res.status(200).json({
                    message: `Another template for Order ${orderNumber} already exists.`
                });
            }
        }

        // If new template link is provided and different from old one, delete old file
        if (templateLink && templateLink !== existingTemplate.templateLink) {
            const oldFilePath = getFilePathFromUrl(existingTemplate.templateLink);
            if (oldFilePath) {
                deleteFile(oldFilePath);
                console.log(`Old file removed during update: ${existingTemplate.templateLink}`);
            }
        }

        const updateData = {};
        if (orderNumber !== undefined) updateData.orderNumber = orderNumber;
        if (templateLink !== undefined) updateData.templateLink = templateLink;
        if (fileName !== undefined) updateData.fileName = fileName;
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (isActive !== undefined) updateData.isActive = isActive;

        const updatedTemplate = await NewsletterTemplate.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            message: "Newsletter template updated successfully",
            template: updatedTemplate
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Fetch All Newsletter Templates (POST method)
router.post("/fetch", async (req, res) => {
    try {
        const { orderNumber, isActive } = req.body;

        // Build query object based on filters
        const query = {};
        if (orderNumber !== undefined) {
            query.orderNumber = orderNumber;
        }
        if (isActive !== undefined) {
            query.isActive = isActive;
        }

        const templates = await NewsletterTemplate.find(query).sort({ orderNumber: 1 });

        res.json({
            count: templates.length,
            templates
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Fetch Single Newsletter Template by ID or Order Number (POST method)
router.post("/fetch-one", async (req, res) => {
    try {
        const { id, orderNumber } = req.body;

        let template;
        
        if (id) {
            template = await NewsletterTemplate.findById(id);
        } else if (orderNumber) {
            template = await NewsletterTemplate.findOne({ orderNumber });
        } else {
            return res.status(400).json({ message: "Please provide either id or orderNumber" });
        }

        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        res.json({ template });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete Newsletter Template
router.post("/delete", async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Template ID is required" });
        }

        // Find template first to get file path
        const templateToDelete = await NewsletterTemplate.findById(id);

        if (!templateToDelete) {
            return res.status(404).json({ message: "Template not found" });
        }

        // Delete associated file from server
        const filePath = getFilePathFromUrl(templateToDelete.templateLink);
        if (filePath) {
            deleteFile(filePath);
            console.log(`File deleted along with template: ${templateToDelete.templateLink}`);
        }

        // Delete template from database
        await NewsletterTemplate.findByIdAndDelete(id);

        res.json({ 
            message: "Newsletter template and associated file deleted successfully",
            template: templateToDelete
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Templates as Object (for cron job) - GET method for internal use
router.get("/get-templates-object", async (req, res) => {
    try {
        const templates = await NewsletterTemplate.find({ isActive: true }).sort({ orderNumber: 1 });
        
        // Convert to object format { 1: "link", 2: "link", ... }
        const templatesObject = {};
        templates.forEach(template => {
            templatesObject[template.orderNumber] = template.templateLink;
        });

        res.json({
            success: true,
            templates: templatesObject
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
