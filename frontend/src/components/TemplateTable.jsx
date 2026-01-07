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
    Chip,
    Link
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';

const TemplateTable = ({ templates, onEdit, onDelete }) => {
    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getOrderLabel = (orderNumber) => {
        return orderNumber === 14 ? "Overview" : `Order ${orderNumber}`;
    };

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 3 }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#7b6e4b' }}>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Order Number</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Title</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Description</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Template Link</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Updated Date</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {templates && templates.length > 0 ? (
                        templates.map((template) => (
                            <TableRow key={template._id} hover>
                                <TableCell>
                                    <Chip
                                        label={getOrderLabel(template.orderNumber)}
                                        color="primary"
                                        size="small"
                                        sx={{ bgcolor: '#7b6e4b', color: '#fff', fontWeight: 'bold' }}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: '500' }}>{template.title}</TableCell>
                                <TableCell sx={{ maxWidth: 250 }}>
                                    {template.description || '-'}
                                </TableCell>
                                <TableCell sx={{ maxWidth: 200 }}>
                                    <Link
                                        href={template.templateLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            color: '#7b6e4b',
                                            textDecoration: 'none',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        <LinkIcon fontSize="small" />
                                        View Template
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={template.isActive ? 'Active' : 'Inactive'}
                                        color={template.isActive ? 'success' : 'default'}
                                        size="small"
                                        sx={{
                                            fontWeight: 'bold',
                                            bgcolor: template.isActive ? '#4caf50' : '#9e9e9e',
                                            color: '#fff'
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{formatDate(template.updatedAt)}</TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        <IconButton
                                            onClick={() => onEdit(template)}
                                            sx={{
                                                color: '#7b6e4b',
                                                '&:hover': { bgcolor: 'rgba(123, 110, 75, 0.1)' }
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => onDelete(template._id)}
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
                                No templates found. Click "Add Template" to create one.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TemplateTable;
