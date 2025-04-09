import { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingOverlay from "../components/LoadingOverlay";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const checkEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://collabnote-fullstack-app.onrender.com/auth/check-email-exists",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      if (!res.ok) throw new Error("Error checking email");
      const data = await res.json();
      setEmailExists(data.exists);
      if (!data.exists) {
        alert("Email not found");
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!emailExists) {
      alert("No valid email to reset");
      return;
    }
    if (newPass !== confirmPass) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        "https://collabnote-fullstack-app.onrender.com/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            newPassword: newPass,
            confirmPassword: confirmPass,
          }),
        },
      );
      if (!res.ok) throw new Error("Error resetting password");
      alert(
        "Password reset successful! You can now login with your new password.",
      );
    } catch (err) {
      alert(
        err +
          " - Please check your email and password. It may also be that this Supabase project is paused. If you encounter this issue again, please contact the project owner for assistance.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay loading={loading} />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, backgroundColor: "background.paper" }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Forgot Password
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            Enter your email to reset your password.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailExists === true}
              onKeyPress={(e) => e.key === "Enter" && checkEmail()}
            />
            {emailExists === null && (
              <Button variant="contained" onClick={checkEmail}>
                Check Email
              </Button>
            )}
            {emailExists === true && (
              <>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Email found! Enter your new password. Remember to keep it
                  safe.
                </Typography>
                <TextField
                  label="New Password"
                  type={showNewPass ? "text" : "password"}
                  fullWidth
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && resetPassword()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPass(!showNewPass)}
                          edge="end"
                        >
                          {showNewPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm New Password"
                  type={showConfirmPass ? "text" : "password"}
                  fullWidth
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && resetPassword()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          edge="end"
                        >
                          {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button variant="contained" onClick={resetPassword}>
                  Reset Password
                </Button>
              </>
            )}
            <Typography variant="body2" sx={{ mt: 2 }}>
              Remembered your password?{" "}
              <Link
                to="/login"
                style={{
                  color: "#00695c",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                Login Here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
