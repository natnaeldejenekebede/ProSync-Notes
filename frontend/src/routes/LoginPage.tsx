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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://collabnote-fullstack-app.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      console.log(response);
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      navigate("/notes");
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
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: "background.paper",
            transition: "background-color 0.3s ease",
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Login
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            Login to your account to create & access your notes.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="text"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{ fontWeight: 600 }}
            >
              Login
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Forgot your password?{" "}
            <Link
              to="/forgot-password"
              style={{
                color: "#00695c",
                textDecoration: "underline",
                fontWeight: "bold",
              }}
            >
              Reset Password
            </Link>
          </Typography>
        </Paper>
      </Container>
    </>
  );
}
