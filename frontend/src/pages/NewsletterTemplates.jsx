import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    AppBar,
    Toolbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoluxe.png';
import TemplateTable from '../components/TemplateTable';
import EditTemplateDialog from '../components/EditTemplateDialog';
import axios from 'axios';
import { apiUrl } from './constant';

const NewsletterTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('edit'); // 'add' or 'edit'
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();

    // Fetch all newsletter templates
    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/api/newsletter-templates/fetch`, {});
            setTemplates(response.data.templates || []);
        } catch (error) {
            console.error('Error fetching templates:', error);
            showSnackbar('Failed to fetch templates', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleBackToDashboard = () => {
        navigate('/newsletter-management');
    };

    const handleAddTemplate = () => {
        setDialogMode('add');
        setSelectedTemplate(null);
        setEditDialogOpen(true);
    };

    const handleEdit = (template) => {
        setDialogMode('edit');
        setSelectedTemplate(template);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedTemplate(null);
    };

    const handleSaveTemplate = async (templateData, mode) => {
        try {
            const endpoint = mode === 'add' ? '/add' : '/update';
            const response = await axios.post(`${apiUrl}/api/newsletter-templates${endpoint}`, templateData);
            
            if (response.data.message && response.data.message.includes('already exists')) {
                showSnackbar(response.data.message, 'warning');
            } else {
                showSnackbar(
                    mode === 'add' ? 'Template added successfully' : 'Template updated successfully',
                    'success'
                );
                fetchTemplates(); // Refresh the list
                handleEditDialogClose();
            }
        } catch (error) {
            console.error('Error saving template:', error);
            showSnackbar('Failed to save template', 'error');
        }
    };

    const handleDeleteClick = (templateId) => {
        setTemplateToDelete(templateId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.post(`${apiUrl}/api/newsletter-templates/delete`, { id: templateToDelete });
            showSnackbar('Template deleted successfully', 'success');
            fetchTemplates(); // Refresh the list
            setDeleteDialogOpen(false);
            setTemplateToDelete(null);
        } catch (error) {
            console.error('Error deleting template:', error);
            showSnackbar('Failed to delete template', 'error');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setTemplateToDelete(null);
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ fontFamily: 'Oxygen, Helvetica, Arial, Lucida, sans-serif', bgcolor: '#f8f6f2', minHeight: '100vh' }}>
            {/* Header */}
            <AppBar position="static" sx={{ bgcolor: '#ffffff', boxShadow: 2, mb: 4 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Logo" style={{ height: 50, width: 'auto', marginRight: 16 }} />
                        <Typography variant="h6" sx={{ color: '#7b6e4b', fontWeight: 600 }}>
                            Newsletter Template Management
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleBackToDashboard}
                            sx={{ borderColor: '#7b6e4b', color: '#7b6e4b' }}
                        >
                            Back to Newsletters
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleLogout}
                            sx={{ borderColor: '#7b6e4b', color: '#7b6e4b' }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box maxWidth="xl" mx="auto" px={4}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: '#7b6e4b', fontWeight: 600 }}>
                        Newsletter Templates ({templates.length}/13)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddTemplate}
                            sx={{
                                bgcolor: '#7b6e4b',
                                '&:hover': { bgcolor: '#6c6240' }
                            }}
                        >
                            Add Template
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={fetchTemplates}
                            disabled={loading}
                            sx={{
                                borderColor: '#7b6e4b',
                                color: '#7b6e4b',
                                '&:hover': { borderColor: '#6c6240' }
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Refresh'}
                        </Button>
                    </Box>
                </Box>

                {/* Info Box */}
                <Box sx={{
                    bgcolor: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: 2,
                    p: 2,
                    mb: 3
                }}>
                    <Typography variant="body2" sx={{ color: '#856404' }}>
                        <strong>📌 Note:</strong> You need to add 13 templates (Order 1 to Order 13). 
                        Subscribers will receive newsletters sequentially based on their subscription date, 
                        starting with Order 1 in their first month, Order 2 in their second month, and so on.
                    </Typography>
                </Box>

                {/* Templates Table */}
                {loading && templates.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#7b6e4b' }} />
                    </Box>
                ) : (
                    <TemplateTable
                        templates={templates}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                )}
            </Box>

            {/* Edit/Add Dialog */}
            <EditTemplateDialog
                open={editDialogOpen}
                onClose={handleEditDialogClose}
                template={selectedTemplate}
                onSave={handleSaveTemplate}
                mode={dialogMode}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                PaperProps={{
                    sx: { borderRadius: 4, p: 2 }
                }}
            >
                <DialogTitle sx={{ color: '#7b6e4b', fontWeight: 'bold' }}>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this template? This action cannot be undone.
                        Subscribers will not receive newsletters for this month if deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={handleDeleteCancel}
                        variant="outlined"
                        sx={{
                            borderColor: '#7b6e4b',
                            color: '#7b6e4b',
                            borderRadius: '12px',
                            textTransform: 'none'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        sx={{
                            backgroundColor: '#d32f2f',
                            borderRadius: '12px',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#b71c1c'
                            }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default NewsletterTemplates;
