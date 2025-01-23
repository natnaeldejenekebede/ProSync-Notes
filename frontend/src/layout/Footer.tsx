import { Box, Typography, IconButton, Link } from '@mui/material';
import {GitHub, Language, LinkedIn, Mail} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

export default function Footer() {
  const location = useLocation();
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  // @ts-ignore
  const [invalidToken, setInvalidToken] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  const navigate = useNavigate();
  const isLoggedIn = !!token && !invalidToken;

  const onLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    navigate('/login');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken !== token) {
        setToken(storedToken);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [token]);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#00695c",
        color: 'white',
        textAlign: 'center',
        py: 3,
        mt: 'auto',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Social Media Icons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mb: 2,
          animation: 'fadeIn 0.5s ease-in-out',
        }}
      >
        <IconButton
          href="https://github.com/hoangsonww/CollabNote-Fullstack-App"
          sx={{
            color: 'white',
            transition: 'transform 0.3s ease, color 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              color: 'secondary.main',
            },
          }}
        >
          <GitHub />
        </IconButton>
        <IconButton
          href="https://www.linkedin.com/in/hoangsonw/"
          sx={{
            color: 'white',
            transition: 'transform 0.3s ease, color 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              color: 'secondary.main',
            },
          }}
        >
          <LinkedIn />
        </IconButton>
        <IconButton
          href="https://sonnguyenhoang.com"
          sx={{
            color: 'white',
            transition: 'transform 0.3s ease, color 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              color: 'secondary.main',
            },
          }}
        >
          <Language />
        </IconButton>
        <IconButton
          href="mailto:hoangson091104@gmail.com"
          sx={{
            color: 'white',
            transition: 'transform 0.3s ease, color 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              color: 'secondary.main',
            },
          }}
        >
          <Mail />
        </IconButton>
      </Box>

      {/* Navigation Links */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 2,
          animation: 'fadeIn 0.5s ease-in-out 0.2s',
          animationFillMode: 'forwards',
        }}
      >
        <Link
          href="/"
          sx={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: isActive('/') ? 'bold' : 'normal',
            borderBottom: isActive('/') ? '3px solid #fff' : 'none',
            transition: 'color 0.3s ease, transform 0.3s ease',
            '&:hover': {
              color: 'secondary.main',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Home
        </Link>
        <Link
          href="/notes"
          sx={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: isActive('/notes') ? 'bold' : 'normal',
            borderBottom: isActive('/notes') ? '3px solid #fff' : 'none',
            transition: 'color 0.3s ease, transform 0.3s ease',
            '&:hover': {
              color: 'secondary.main',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Notes
        </Link>
        <Link
          href="/profile"
          sx={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: isActive('/profile') ? 'bold' : 'normal',
            borderBottom: isActive('/profile') ? '3px solid #fff' : 'none',
            transition: 'color 0.3s ease, transform 0.3s ease',
            '&:hover': {
              color: 'secondary.main',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Profile
        </Link>
        { isLoggedIn && (
          <Link
            href="#"
            onClick={onLogout}
            sx={{
              color: 'red',
              textDecoration: 'none',
              fontWeight: 'normal',
              transition: 'color 0.3s ease, transform 0.3s ease',
              '&:hover': {
                color: 'secondary.main',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Logout
          </Link>
        )}
        {!isLoggedIn && (
          <>
            <Link
              href="/login"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: isActive('/login') ? 'bold' : 'normal',
                borderBottom: isActive('/login') ? '3px solid #fff' : 'none',
                transition: 'color 0.3s ease, transform 0.3s ease',
                '&:hover': {
                  color: 'secondary.main',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Login
            </Link>
          </>
        )}
        <Link
          href="/register"
          sx={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: isActive('/register') ? 'bold' : 'normal',
            borderBottom: isActive('/register') ? '3px solid #fff' : 'none',
            transition: 'color 0.3s ease, transform 0.3s ease',
            '&:hover': {
              color: 'secondary.main',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Register
        </Link>
      </Box>

      {/* Footer Text */}
      <Typography
        variant="body2"
        sx={{
          animation: 'fadeIn 0.5s ease-in-out 0.4s',
          animationFillMode: 'forwards',
        }}
      >
        © {new Date().getFullYear()} CollabNote. All rights reserved.
      </Typography>
    </Box>
  );
}
