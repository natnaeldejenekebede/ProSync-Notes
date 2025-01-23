import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import { Menu as MenuIcon, LightMode, DarkMode } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeContext } from '../theme/ThemeContext';
import ResponsiveDrawer from './ResponsiveDrawer';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [invalidToken, setInvalidToken] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!token && !invalidToken;

  const onLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Poll localStorage every second to update token state
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken !== token) {
        setToken(storedToken);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [token]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const t = localStorage.getItem('access_token');
      if (!t) {
        setToken(null);
        clearInterval(interval);
        return;
      }
      try {
        const resp = await fetch('http://localhost:4000/profile/me', {
          headers: {
            Authorization: `Bearer ${t}`,
          },
        });
        if (resp.status === 401) {
          localStorage.removeItem('access_token');
          setToken(null);
          setInvalidToken(true);
          clearInterval(interval);
        }
      } catch {
        localStorage.removeItem('access_token');
        setToken(null);
        setInvalidToken(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AppBar position="static" color="primary" sx={{ mb: 0 }}>
        <Toolbar sx={{ transition: 'background-color 0.3s ease' }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            CollabNote
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              sx={{
                borderBottom: isActive('/') ? '3px solid #fff' : 'none',
                borderRadius: 0,
                fontWeight: isActive('/') ? 'bold' : 'normal',
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/notes')}
              sx={{
                borderBottom: isActive('/notes') ? '3px solid #fff' : 'none',
                fontWeight: isActive('/notes') ? 'bold' : 'normal',
                borderRadius: 0,
              }}
            >
              Notes
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/profile')}
              sx={{
                borderBottom: isActive('/profile') ? '3px solid #fff' : 'none',
                fontWeight: isActive('/profile') ? 'bold' : 'normal',
                borderRadius: 0,
              }}
            >
              Profile
            </Button>
            {!isLoggedIn && (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderBottom: isActive('/login') ? '3px solid #fff' : 'none',
                    fontWeight: isActive('/login') ? 'bold' : 'normal',
                    borderRadius: 0,
                  }}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/register')}
                  sx={{
                    borderBottom: isActive('/register') ? '3px solid #fff' : 'none',
                    fontWeight: isActive('/register') ? 'bold' : 'normal',
                    borderRadius: 0,
                  }}
                >
                  Register
                </Button>
              </>
            )}
            {isLoggedIn && (
              <Button
                sx={{ color: 'red', borderRadius: 0 }}
                onClick={onLogout}
              >
                Logout
              </Button>
            )}
            <IconButton color="inherit" onClick={toggleTheme}>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <ResponsiveDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
    </>
  );
}
