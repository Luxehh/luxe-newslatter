import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    Paper,
    Grid,
} from "@mui/material";
import axios from "axios";
import { apiUrl } from "./constant";

const EditPatient = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipcode: "",
        contactNo: "",
        age: "",
        startDate: "",
    });
    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    
    const formatUTCToLocal = (utcDateString) => {
        const utcDate = new Date(utcDateString);  // Create a Date object from the UTC string
        const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);  // Adjust by the timezone offset
        return localDate.toISOString();  // You can format this as per your requirements (e.g., ISO string)
    }

    const fetchPatient = useCallback(async () => {
        try {
            setLoading(true);
            // const res = await axios.get(`https://luxe-api-production-d5c9.up.railway.app/api/patients/${id}`);
            const res = await axios.get(`${apiUrl}/api/patients/${id}`);
            const data = { ...res.data };

            // ✅ Remove +1 from contactNo for display
            if (data.contactNo?.startsWith("+1")) {
                data.contactNo = formatPhoneNumber(data.contactNo.slice(2));
            } else {
                data.contactNo = formatPhoneNumber(data.contactNo);
            }

            if (data.startDate) {
                data.startDate = formatUTCToLocal(data.startDate);
            }
            setFormData(data);
        } catch (err) {
            setSnack({ open: true, message: "Failed to load patient", severity: "error" });
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPatient();
    }, [fetchPatient]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "contactNo") {
            const prev = formData.contactNo || "";
            const isDeleting = value.length < prev.length;

            setFormData((prev) => ({
                ...prev,
                [name]: isDeleting ? value : formatPhoneNumber(value),
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 10); // Limit to 10 digits
        const len = cleaned.length;

        if (len < 4) return cleaned;
        if (len < 7) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    };

    const validateForm = () => {
        const newErrors = {};
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

        if (!formData.contactNo) {
            newErrors.contactNo = "Contact number is required";
        } else if (!phoneRegex.test(formData.contactNo)) {
            newErrors.contactNo = "Format should be (123) 456-7890";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            // ✅ Add +1 and strip formatting for backend
            const rawPhone = formData.contactNo.replace(/\D/g, "");
            const payload = {
                ...formData,
                contactNo: "+1" + rawPhone,
            };

            const response = await axios.put(
                // `https://luxe-api-production-d5c9.up.railway.app/api/patients/${id}`,
                `${apiUrl}/api/patients/${id}`,
                payload
            );

            if (response?.data?.message === 'Patient with this contact number already exists.') {
                setSnack({
                    open: true,
                    message: "Patient with this contact number already exists.",
                    severity: "warning",
                });
                return;
            }

            setSnack({ open: true, message: "Patient updated successfully!", severity: "success" });
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (error) {
            setSnack({ open: true, message: "Failed to update patient", severity: "error" });
        }
    };

    const handleBack = () => navigate("/dashboard");

    if (loading) {
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
                <Typography variant="h6">Loading patient data...</Typography>
            </Box>
        );
    }
    

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
                    maxWidth: 800,
                    borderRadius: "16px",
                    backgroundColor: "white",
                }}
            >
                <Typography variant="h5" gutterBottom textAlign="center">
                    Edit Patient
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
                                label="Zipcode"
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
                                value={formData.startDate?.slice(0, 10) || ""}
                                // value={formData.startDate ? formatToLocalYYYYMMDD(formData.startDate) : ""}
                                onChange={handleChange}
                                fullWidth
                                type="date"
                                InputLabelProps={{ shrink: true }}
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
                            Update
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

export default EditPatient;
