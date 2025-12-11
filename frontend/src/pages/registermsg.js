import React from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    AppBar,
    Toolbar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import logo from '../assets/logo.png';

const points = [
    "Our collective aim is to send you the right information at the right time to make preparing and recovering from surgery easier.",
    "The texts are automated and include both scheduled informational messages and automated responses to your questions through our chatbot system. These messages are not being sent to you by your physician.",
    "Your physician doesn't monitor these messages. While our chatbot can answer common questions about preparation and recovery, you may not use this service to contact your physician about urgent or emergent health issues. If you're having a medical emergency, call 911.",
    "The text program uses artificial intelligence (AI) to provide automated responses to your questions about surgical preparation and recovery. To improve the accuracy of our responses, we use de-identified message data to enhance our service.",
    "We take your privacy very seriously and are fully compliant with the federal government regulations regarding the privacy of personal health information (PHI).",
    "Your information is stored securely on encrypted cloud-based servers. However, as noted below, the SMS messages themselves are not encrypted during transmission.",
    "If you elect to include your PHI in a response, please be aware that short message service (SMS) and multimedia message (MMS) do have security shortcomings. They are unencrypted and may be stored on your mobile service provider's server for a short period of time.",
    "Messages are limited to surgical preparation and recovery information. You will only receive messages relevant to your surgical timeline.",
    "If there is a difference between the information in a text message and what you were told by your physician, follow their individual instructions for you.",
    "Please, when in doubt, call your physician's office for further clarification.",
    "SMS Reply Keywords: You can reply with the following keywords to receive specific guidance or log information — *Weigh*, *DailyCheckup*, *SymptomTracker*, *Medications*, *HealthyDiet*, *Easy*, *Hard*, *Moderate*."
];

const RegisterMsg = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ bgcolor: '#f8f6f2', minHeight: '100vh', fontFamily: 'Oxygen, Helvetica, Arial, Lucida, sans-serif' }}>
            <AppBar position="static" sx={{ bgcolor: '#ffffff', boxShadow: 2, mb: 4 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Logo" style={{ height: 50, width: 'auto', marginRight: 16 }} />
                        <Typography variant="h6" sx={{ color: '#7b6e4b', fontWeight: 600 }}>
                            Welcome to Luxe Home Health
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 5 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: '#ffffffdd' }}>
                    <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom fontWeight="bold" color="primary">
                        Welcome to the Luxe Home Health
                    </Typography>

                    <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                        Before you begin, please review the following important information:
                    </Typography>

                    <List>
                        {points.map((point, index) => (
                            <ListItem key={index} alignItems="flex-start" sx={{ mb: 1 }}>
                                <ListItemIcon>
                                    <CheckCircleIcon color="success" />
                                </ListItemIcon>
                                <ListItemText primary={point} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Container>
        </Box>
    );
};

export default RegisterMsg;
