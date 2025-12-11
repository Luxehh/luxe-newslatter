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
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import NewsletterTable from '../components/NewsletterTable';
import EditNewsletterDialog from '../components/EditNewsletterDialog';
import axios from 'axios';
import { apiUrl } from './constant';

const NewsletterManagement = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSubscriber, setSelectedSubscriber] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [subscriberToDelete, setSubscriberToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();

    // Fetch all newsletter subscribers
    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/api/newsletter/fetch`, {});
            setSubscribers(response.data.subscribers || []);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            showSnackbar('Failed to fetch subscribers', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleEdit = (subscriber) => {
        setSelectedSubscriber(subscriber);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedSubscriber(null);
    };

    const handleSaveEdit = async (updatedData) => {
        try {
            const response = await axios.post(`${apiUrl}/api/newsletter/update`, updatedData);

            // const twillo = await axios.post(`${apiUrl}/api/newsletter/test-twilio`, {});
            // if(twillo.data.success){
            //     showSnackbar('Twilio test message sent successfully', 'success');
            // }else{
            //     showSnackbar('Failed to send Twilio test message', 'error');
            // }

            if (response.data.message && response.data.message.includes('already exists')) {
                showSnackbar(response.data.message, 'warning');
            } else {
                showSnackbar('Subscriber updated successfully', 'success');
                fetchSubscribers(); // Refresh the list
                handleEditDialogClose();
            }
        } catch (error) {
            console.error('Error updating subscriber:', error);
            showSnackbar('Failed to update subscriber', 'error');
        }
    };

    const handleDeleteClick = (subscriberId) => {
        setSubscriberToDelete(subscriberId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.post(`${apiUrl}/api/newsletter/delete`, { id: subscriberToDelete });
            showSnackbar('Subscriber deleted successfully', 'success');
            fetchSubscribers(); // Refresh the list
            setDeleteDialogOpen(false);
            setSubscriberToDelete(null);
        } catch (error) {
            console.error('Error deleting subscriber:', error);
            showSnackbar('Failed to delete subscriber', 'error');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSubscriberToDelete(null);
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
                            Newsletter Management
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* <Button
                            variant="outlined"
                            onClick={handleBackToDashboard}
                            sx={{ borderColor: '#7b6e4b', color: '#7b6e4b' }}
                        >
                            Back to Dashboard
                        </Button> */}
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
                        Newsletter Subscribers ({subscribers.length})
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/newsletter-templates')}
                            sx={{
                                borderColor: '#7b6e4b',
                                color: '#7b6e4b',
                                '&:hover': { borderColor: '#6c6240', bgcolor: 'rgba(123, 110, 75, 0.1)' }
                            }}
                        >
                            Manage Templates
                        </Button>
                        <Button
                            variant="contained"
                            onClick={fetchSubscribers}
                            disabled={loading}
                            sx={{
                                bgcolor: '#7b6e4b',
                                '&:hover': { bgcolor: '#6c6240' }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Refresh'}
                        </Button>
                    </Box>
                </Box>

                {/* Newsletter Table */}
                {loading && subscribers.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#7b6e4b' }} />
                    </Box>
                ) : (
                    <NewsletterTable
                        subscribers={subscribers}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                )}
            </Box>

            {/* Edit Dialog */}
            <EditNewsletterDialog
                open={editDialogOpen}
                onClose={handleEditDialogClose}
                subscriber={selectedSubscriber}
                onSave={handleSaveEdit}
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
                        Are you sure you want to delete this subscriber? This action cannot be undone.
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

export default NewsletterManagement;
