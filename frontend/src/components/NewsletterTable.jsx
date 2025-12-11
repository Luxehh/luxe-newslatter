import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Box,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const NewsletterTable = ({ subscribers, onEdit, onDelete }) => {
    const formatPhoneNumber = (number) => {
        if (!number) return '-';

        // Remove all non-digit characters
        let digits = number.replace(/\D/g, '');

        // Remove leading '1' if it's a US country code and length is 11
        if (digits.length === 11 && digits.startsWith('1')) {
            digits = digits.slice(1);
        }

        // Format if 10 digits
        if (digits.length === 10) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }

        // Return original if not 10 digits after normalization
        return number;
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 3 }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#7b6e4b' }}>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>First Name</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Last Name</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Phone Number</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Created Date</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Updated Date</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subscribers && subscribers.length > 0 ? (
                        subscribers.map((subscriber) => (
                            <TableRow key={subscriber._id} hover>
                                <TableCell>{subscriber.firstName}</TableCell>
                                <TableCell>{subscriber.lastName}</TableCell>
                                <TableCell>{formatPhoneNumber(subscriber.phoneNumber)}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={subscriber.status ? 'Active' : 'Inactive'}
                                        color={subscriber.status ? 'success' : 'default'}
                                        size="small"
                                        sx={{
                                            fontWeight: 'bold',
                                            bgcolor: subscriber.status ? '#4caf50' : '#9e9e9e',
                                            color: '#fff'
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{formatDate(subscriber.createdAt)}</TableCell>
                                <TableCell>{formatDate(subscriber.updatedAt)}</TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        <IconButton
                                            onClick={() => onEdit(subscriber)}
                                            sx={{
                                                color: '#7b6e4b',
                                                '&:hover': { bgcolor: 'rgba(123, 110, 75, 0.1)' }
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => onDelete(subscriber._id)}
                                            sx={{
                                                color: '#d32f2f',
                                                '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' }
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                No subscribers found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default NewsletterTable;
