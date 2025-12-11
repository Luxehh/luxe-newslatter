import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    FormControlLabel,
    Switch,
    Typography,
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { apiUrl } from '../pages/constant';

const EditTemplateDialog = ({ open, onClose, template, onSave, mode = 'edit' }) => {
    const [formData, setFormData] = useState({
        orderNumber: '',
        templateLink: '',
        fileName: '',
        title: '',
        description: '',
        isActive: true
    });

    const [errors, setErrors] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    useEffect(() => {
        if (template && mode === 'edit') {
            setFormData({
                orderNumber: template.orderNumber || '',
                templateLink: template.templateLink || '',
                fileName: template.fileName || '',
                title: template.title || '',
                description: template.description || '',
                isActive: template.isActive !== undefined ? template.isActive : true
            });
            setErrors({});
        } else if (mode === 'add') {
            setFormData({
                orderNumber: '',
                templateLink: '',
                fileName: '',
                title: '',
                description: '',
                isActive: true
            });
            setErrors({});
            setSelectedFile(null);
            setUploadError('');
        }
    }, [template, mode, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('Only PDF and DOC files are allowed');
            return;
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            setUploadError('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
        setUploadError('');

        // Upload file immediately
        await uploadFile(file);
    };

    const uploadFile = async (file) => {
        setUploading(true);
        setUploadError('');

        try {
            const formDataToUpload = new FormData();
            formDataToUpload.append('file', file);

            const response = await axios.post(`${apiUrl}/api/newsletter-templates/upload`, formDataToUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update form data with uploaded file URL
            setFormData(prev => ({
                ...prev,
                templateLink: response.data.fileUrl,
                fileName: response.data.fileName
            }));

            // Clear any template link errors
            setErrors(prev => ({
                ...prev,
                templateLink: ''
            }));

        } catch (error) {
            console.error('Upload error:', error);
            setUploadError(error.response?.data?.error || 'Failed to upload file');
            setSelectedFile(null);
        } finally {
            setUploading(false);
        }
    };

    const handleStatusChange = (e) => {
        setFormData(prev => ({
            ...prev,
            isActive: e.target.checked
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.orderNumber || formData.orderNumber < 1 || formData.orderNumber > 12) {
            newErrors.orderNumber = 'Order number must be between 1 and 12';
        }

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.templateLink.trim()) {
            newErrors.templateLink = 'Please upload a template file';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const submitData = {
                ...formData,
                orderNumber: parseInt(formData.orderNumber)
            };

            if (mode === 'edit' && template) {
                submitData.id = template._id;
            }

            onSave(submitData, mode);
        }
    };

    const handleCancel = () => {
        setFormData({
            orderNumber: '',
            templateLink: '',
            fileName: '',
            title: '',
            description: '',
            isActive: true
        });
        setErrors({});
        setSelectedFile(null);
        setUploadError('');
        onClose();
    };

    const orderOptions = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    p: 2
                }
            }}
        >
            <DialogTitle sx={{ color: '#7b6e4b', fontWeight: 'bold', fontSize: '1.5rem' }}>
                {mode === 'add' ? 'Add Newsletter Template' : 'Edit Newsletter Template'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        select
                        label="Order Number"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        error={!!errors.orderNumber}
                        helperText={errors.orderNumber || 'Select sequential order (1-12) for newsletter delivery'}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            sx: { borderRadius: '12px' }
                        }}
                        sx={{
                            '& label.Mui-focused': { color: '#7b6e4b' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#ccc' },
                                '&:hover fieldset': { borderColor: '#7b6e4b' },
                                '&.Mui-focused fieldset': { borderColor: '#7b6e4b' }
                            }
                        }}
                    >
                        {orderOptions.map((order) => (
                            <MenuItem key={order} value={order}>
                                Order {order}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        error={!!errors.title}
                        helperText={errors.title}
                        fullWidth
                        variant="outlined"
                        placeholder="e.g., Heart Health - January Newsletter"
                        InputProps={{
                            sx: { borderRadius: '12px' }
                        }}
                        sx={{
                            '& label.Mui-focused': { color: '#7b6e4b' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#ccc' },
                                '&:hover fieldset': { borderColor: '#7b6e4b' },
                                '&.Mui-focused fieldset': { borderColor: '#7b6e4b' }
                            }
                        }}
                    />

                    {/* File Upload Section */}
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500 }}>
                            Upload Newsletter File (PDF/DOC) *
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                                disabled={uploading}
                                sx={{
                                    borderColor: '#7b6e4b',
                                    color: '#7b6e4b',
                                    borderRadius: '12px',
                                    '&:hover': {
                                        borderColor: '#6c6240',
                                        bgcolor: '#f5f5f5'
                                    }
                                }}
                            >
                                {uploading ? 'Uploading...' : 'Choose File'}
                                <input
                                    type="file"
                                    hidden
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                />
                            </Button>
                            {formData.fileName && (
                                <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                                    ✓ {formData.fileName}
                                </Typography>
                            )}
                        </Box>
                        {uploadError && (
                            <Alert severity="error" sx={{ mt: 1, borderRadius: '12px' }}>
                                {uploadError}
                            </Alert>
                        )}
                        {errors.templateLink && (
                            <Typography variant="caption" sx={{ color: '#d32f2f', mt: 0.5, display: 'block' }}>
                                {errors.templateLink}
                            </Typography>
                        )}
                        {formData.templateLink && (
                            <Typography variant="caption" sx={{ color: '#666', mt: 0.5, display: 'block' }}>
                                File URL: {formData.templateLink}
                            </Typography>
                        )}
                    </Box>

                    <TextField
                        label="Description (Optional)"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="Brief description of the newsletter content"
                        InputProps={{
                            sx: { borderRadius: '12px' }
                        }}
                        sx={{
                            '& label.Mui-focused': { color: '#7b6e4b' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#ccc' },
                                '&:hover fieldset': { borderColor: '#7b6e4b' },
                                '&.Mui-focused fieldset': { borderColor: '#7b6e4b' }
                            }
                        }}
                    />

                    <Box sx={{ mt: 1 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isActive}
                                    onChange={handleStatusChange}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#7b6e4b'
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#7b6e4b'
                                        }
                                    }}
                                />
                            }
                            label={
                                <Typography variant="body1">
                                    Status: {formData.isActive ? 'Active' : 'Inactive'}
                                </Typography>
                            }
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button
                    onClick={handleCancel}
                    variant="outlined"
                    sx={{
                        borderColor: '#7b6e4b',
                        color: '#7b6e4b',
                        borderRadius: '12px',
                        textTransform: 'none',
                        '&:hover': {
                            borderColor: '#6c6240',
                            bgcolor: 'rgba(123, 110, 75, 0.1)'
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: '#7b6e4b',
                        borderRadius: '12px',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#6c6240'
                        }
                    }}
                >
                    {mode === 'add' ? 'Add Template' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditTemplateDialog;
