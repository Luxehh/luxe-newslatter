import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    AppBar,
    Toolbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add'; // Add icon for the button
import EmailIcon from '@mui/icons-material/Email'; // Newsletter icon
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from './constant';

const Dashboard = () => {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    const fetchPatients = async () => {
        try {
            // const res = await axios.get('https://luxe-api-production-d5c9.up.railway.app/api/patients');
            const res = await axios.get(`${apiUrl}/api/patients`);
            setPatients(res.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleEdit = (id) => {
        navigate(`/edit-patient/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            // await axios.delete(`https://luxe-api-production-d5c9.up.railway.app/api/patients/${id}`);
            await axios.delete(`${apiUrl}/api/patients/${id}`);
            setPatients(patients.filter((patient) => patient._id !== id));
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    const handleAddPatient = () => {
        navigate('/add-patient');
    };

    const handleNewsletterManagement = () => {
        navigate('/newsletter-management');
    };

    // const handleSendMessage = async (patient) => {
    //     try {
    //         await axios.post('https://luxe-api-production-d5c9.up.railway.app/api/patients/send-message', patient);
    //         alert("Message sent successfully!");
    //     } catch (error) {
    //         console.error("Failed to send message", error);
    //         alert("Failed to send message.");
    //     }
    // };

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
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`;
        }

        // Return original if not 10 digits after normalization
        return number;
    };


    return (
        <Box sx={{ fontFamily: 'Oxygen, Helvetica, Arial, Lucida, sans-serif', bgcolor: '#f8f6f2', minHeight: '100vh' }}>
            {/* Header */}
            <AppBar position="static" sx={{ bgcolor: '#ffffff', boxShadow: 2, mb: 4 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Logo" style={{ height: 50, width: 'auto', marginRight: 16 }} />
                        <Typography variant="h6" sx={{ color: '#7b6e4b', fontWeight: 600 }}>
                            Welcome to Luxe Home Health
                        </Typography>
                    </Box>
                    <Button variant="outlined" onClick={handleLogout} sx={{ borderColor: '#7b6e4b', color: '#7b6e4b' }}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Add Patient Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2, mx: 4 }}>
                <Button
                    variant="contained"
                    startIcon={<EmailIcon />}
                    onClick={handleNewsletterManagement}
                    sx={{ bgcolor: '#7b6e4b', '&:hover': { bgcolor: '#6c6240' } }}
                >
                    Newsletter Management
                </Button>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddPatient}
                    sx={{ bgcolor: '#7b6e4b', '&:hover': { bgcolor: '#6c6240' } }}
                >
                    Add Patient
                </Button>
            </Box>

            {/* Table */}
            <Box maxWidth="xl" mx="auto" px={4}>
                <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#7b6e4b' }}>
                                <TableCell sx={{ color: '#fff' }}>First Name</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Last Name</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Age</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Contact</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Address</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Start Date</TableCell>
                                <TableCell sx={{ color: '#fff' }} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patients.map((patient) => (
                                <TableRow key={patient._id} hover>
                                    <TableCell>{patient.firstName}</TableCell>
                                    <TableCell>{patient.lastName || '-'}</TableCell>
                                    <TableCell>{patient.age || '-'}</TableCell>
                                    <TableCell>{formatPhoneNumber(patient.contactNo)}</TableCell>
                                    <TableCell>
                                        {`${patient.addressLine1 || ''} ${patient.addressLine2 || ''}`.trim() || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {patient.startDate
                                            ? new Date(patient.startDate).toLocaleDateString('en-US')
                                            : '-'}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                                            <IconButton onClick={() => handleEdit(patient._id)}>
                                                <EditIcon sx={{ color: '#7b6e4b' }} />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(patient._id)}>
                                                <DeleteIcon sx={{ color: '#7b6e4b' }} />
                                            </IconButton>
                                            {/* <Button
                                                variant="outlined"
                                                onClick={() => handleSendMessage(patient)}
                                                sx={{
                                                    borderColor: '#7b6e4b',
                                                    color: '#7b6e4b',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        backgroundColor: '#7b6e4b',
                                                        color: '#fff'
                                                    }
                                                }}
                                            >
                                                Send Message
                                            </Button> */}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default Dashboard;
