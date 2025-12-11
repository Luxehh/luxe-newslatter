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
    Typography
} from '@mui/material';

const EditNewsletterDialog = ({ open, onClose, subscriber, onSave }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        status: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (subscriber) {
            setFormData({
                firstName: subscriber.firstName || '',
                lastName: subscriber.lastName || '',
                phoneNumber: subscriber.phoneNumber || '',
                status: subscriber.status || false
            });
            setErrors({});
        }
    }, [subscriber]);

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

    const handleStatusChange = (e) => {
        setFormData(prev => ({
            ...prev,
            status: e.target.checked
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave({
                id: subscriber._id,
                ...formData
            });
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            status: false
        });
        setErrors({});
        onClose();
    };

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
                Edit Newsletter Subscription
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
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
                    />

                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
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
                    />

                    <TextField
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
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
                    />

                    <Box sx={{ mt: 1 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.status}
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
                                    Subscription Status: {formData.status ? 'Active' : 'Inactive'}
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
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditNewsletterDialog;
