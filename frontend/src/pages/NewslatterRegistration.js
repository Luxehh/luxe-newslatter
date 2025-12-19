import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import logo from "../assets/logoluxe.png";
import { useAuth } from "./AuthContext";
import { apiUrl } from "./constant";

function NewslatterRegistration() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();

  const validate = () => {
    let valid = true;
    setFirstNameError("");
    setLastNameError("");
    setPhoneNumberError(""); 

    if (!firstName) {
      setFirstNameError("Enter a valid first name");
      valid = false;
    }

    if (!lastName) {
      setLastNameError("Enter a valid last name");
      valid = false;
    }

    if (!phoneNumber) {
      setPhoneNumberError("Enter a valid phone number");
      valid = false;
    }

    return valid;
  };

  const handleRegistration = async () => {
    if (!validate()) { return; }

    try {
      const res = await fetch(`${apiUrl}/api/newsletter/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phoneNumber }),
      });
        const data = await res.json();
        if (data?.message) {
            // Reset form fields
            setFirstName("");
            setLastName("");
            setPhoneNumber("");
            setError("");
            setSuccess("");
            setFirstNameError("");
            setLastNameError("");
            setPhoneNumberError("");
            
            // Check if it's a success or duplicate message
            if (data.message.includes("already exists")) {
                setError(data.message);
            } else {
                setSuccess(data.message);
            }
            //navigate("/registermsg");
        } else {
            setError(data.message || "Registration failed");
        }
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ fontFamily: "'Oxygen', Helvetica, Arial, Lucida, sans-serif" }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            fontFamily: "'Oxygen', Helvetica, Arial, Lucida, sans-serif",
          }}
        >
          <img src={logo} alt="Logo" style={{ width: 150, marginBottom: 16 }} />
          <Typography variant="h5" mb={2}>
            Subscribe to Our Luxe Bereavement Newsletter
          </Typography>

          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={!!firstNameError}
            helperText={firstNameError}
            InputProps={{
              sx: { borderRadius: "12px" },
            }}
            sx={{
              "& label.Mui-focused": { color: "#7b6e4b" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ccc" },
                "&:hover fieldset": { borderColor: "#7b6e4b" },
                "&.Mui-focused fieldset": { borderColor: "#7b6e4b" },
              },
            }}
          />

          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={!!lastNameError}
            helperText={lastNameError}
            InputProps={{
              sx: { borderRadius: "12px" },
            }}
            sx={{
              "& label.Mui-focused": { color: "#7b6e4b" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ccc" },
                "&:hover fieldset": { borderColor: "#7b6e4b" },
                "&.Mui-focused fieldset": { borderColor: "#7b6e4b" },
              },
            }}
          />

          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={!!phoneNumberError}
            helperText={phoneNumberError}
            InputProps={{
              sx: { borderRadius: "12px" },
            }}
            sx={{
              "& label.Mui-focused": { color: "#7b6e4b" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ccc" },
                "&:hover fieldset": { borderColor: "#7b6e4b" },
                "&.Mui-focused fieldset": { borderColor: "#7b6e4b" },
              },
            }}
          />

          {success && (
            <Typography color="success" mt={1} sx={{ color: '#4caf50', fontWeight: 'bold' }}>
              {success}
            </Typography>
          )}

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#7b6e4b",
              borderRadius: "12px",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#6c6240",
              },
            }}
            onClick={handleRegistration}
          >
            Register
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default NewslatterRegistration;
