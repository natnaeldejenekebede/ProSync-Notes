import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Box,
  Toolbar,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResponsiveDrawer({
                                           open,
                                           onClose,
                                           isLoggedIn,
                                           onLogout,
                                           toggleTheme,
                                           isDarkMode,
                                         }: {
  open: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 250 }}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'primary.main',
            color: '#fff',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            CollabNote
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#fff' }}>
            <Close />
          </IconButton>
        </Toolbar>
        <List>
          <ListItemButton
            onClick={() => {
              navigate('/');
              onClose();
            }}
            sx={{
              borderBottom: isActive('/') ? '3px solid #00695c' : 'none',
              fontWeight: isActive('/') ? 'bold' : 'normal',
              color: isActive('/') ? 'primary.main' : 'text.primary',
            }}
          >
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate('/profile');
              onClose();
            }}
            sx={{
              borderBottom: isActive('/profile') ? '3px solid #00695c' : 'none',
              fontWeight: isActive('/profile') ? 'bold' : 'normal',
              color: isActive('/profile') ? 'primary.main' : 'text.primary',
            }}
          >
            <ListItemText primary="Profile" />
          </ListItemButton>
          {isLoggedIn ? (
            <>
              <ListItemButton
                onClick={() => {
                  navigate('/notes');
                  onClose();
                }}
                sx={{
                  borderBottom: isActive('/notes') ? '3px solid #00695c' : 'none',
                  fontWeight: isActive('/notes') ? 'bold' : 'normal',
                  color: isActive('/notes') ? 'primary.main' : 'text.primary',
                }}
              >
                <ListItemText primary="Notes" />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                <ListItemText primary="Logout" sx={{ color: 'red' }} />
              </ListItemButton>
            </>
          ) : (
            <>
              <ListItemButton
                onClick={() => {
                  navigate('/login');
                  onClose();
                }}
                sx={{
                  borderBottom: isActive('/login') ? '3px solid #00695c' : 'none',
                  fontWeight: isActive('/login') ? 'bold' : 'normal',
                  color: isActive('/login') ? 'primary.main' : 'text.primary',
                }}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  navigate('/register');
                  onClose();
                }}
                sx={{
                  borderBottom: isActive('/register') ? '3px solid #00695c' : 'none',
                  fontWeight: isActive('/register') ? 'bold' : 'normal',
                  color: isActive('/register') ? 'primary.main' : 'text.primary',
                }}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </>
          )}
          <ListItemButton
            onClick={() => {
              toggleTheme();
              onClose();
            }}
          >
            <ListItemText primary={isDarkMode ? 'Light Mode' : 'Dark Mode'} />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
