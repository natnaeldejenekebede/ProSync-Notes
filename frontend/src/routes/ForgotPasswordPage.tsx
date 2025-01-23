import { useState } from 'react';
import { Container, Paper, Box, Typography, Button, TextField } from '@mui/material';
import LoadingOverlay from '../components/LoadingOverlay';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  const checkEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/auth/check-email-exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error('Error checking email');
      const data = await res.json();
      setEmailExists(data.exists);
      if (!data.exists) {
        alert('Email not found');
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!emailExists) {
      alert('No valid email to reset');
      return;
    }
    if (newPass !== confirmPass) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          newPassword: newPass,
          confirmPassword: confirmPass
        })
      });
      if (!res.ok) throw new Error('Error resetting password');
      alert('Password reset successful! You can now login with your new password.');
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay loading={loading} />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, backgroundColor: 'background.paper' }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Forgot Password
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailExists === null && (
              <Button variant="contained" onClick={checkEmail}>
                Check Email
              </Button>
            )}
            {emailExists === true && (
              <>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
                <Button variant="contained" onClick={resetPassword}>
                  Reset Password
                </Button>
              </>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
}
