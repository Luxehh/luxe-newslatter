import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, TextField, Button, Typography, Snackbar, Alert, Paper, Grid
} from "@mui/material";
import axios from "axios";
import { apiUrl } from "./constant";

const AddPatient = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        contactNo: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipcode: "",
        startDate: new Date().toISOString().split("T")[0],
    });

    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const formatPhone = (value) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 10); // Only numbers, max 10 digits
        if (cleaned.length < 4) return cleaned;
        if (cleaned.length < 7) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "contactNo") {
            setFormData((prev) => ({
                ...prev,
                [name]: formatPhone(value),
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const rawNumber = formData.contactNo.replace(/\D/g, ""); // Strip formatting

        if (!formData.contactNo) {
            newErrors.contactNo = "Contact number is required";
        } else if (rawNumber.length !== 10) {
            newErrors.contactNo = "Phone number must be 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            ...formData,
            contactNo: `+1${formData.contactNo.replace(/\D/g, "")}`, // Send the raw number with +1
        };

        try {
            // const response = await axios.post("https://luxe-api-production-d5c9.up.railway.app/api/patients/add", payload);
            const response = await axios.post(`${apiUrl}/api/patients/add`, payload);
            if (response?.data?.message === 'Patient with this contact number already exists.') {
                setSnack({
                    open: true,
                    message: "Patient with this contact number already exists.",
                    severity: "warning",
                });
                return;
            }

            setSnack({ open: true, message: "Patient added successfully!", severity: "success" });
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (error) {
            setSnack({ open: true, message: "Failed to add patient", severity: "error" });
        }
    };

    const handleBack = () => navigate("/dashboard");

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#f0f0f0",
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: 700,
                    borderRadius: "16px",
                    backgroundColor: "white",
                }}
            >
                <Typography variant="h5" gutterBottom textAlign="center">
                    Add Patient
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Contact Number"
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.contactNo}
                                helperText={errors.contactNo}
                                placeholder="(123) 456-7890"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Address Line 1"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Address Line 2"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Zip Code"
                                name="zipcode"
                                value={formData.zipcode}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Start Date"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                    </Grid>

                    <Box mt={3} display="flex" justifyContent="space-between">
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            sx={{
                                borderColor: "#7b6e4b",
                                color: "#7b6e4b",
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "#7b6e4b",
                                    color: "#fff",
                                },
                            }}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                backgroundColor: "#7b6e4b",
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "#6a5c3d",
                                },
                            }}
                        >
                            Save
                        </Button>
                    </Box>
                </form>

                <Snackbar
                    open={snack.open}
                    autoHideDuration={3000}
                    onClose={() => setSnack({ ...snack, open: false })}
                >
                    <Alert severity={snack.severity}>{snack.message}</Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default AddPatient;
