import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const pages = [
  { title: 'Dashboard', path: '/dashboard' },
  { title: 'Account', path: '/account' },
  { title: 'Transactions', path: '/transaction' },
];

const settings = [
  { title: 'Logout', path: '/login' },
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    navigate(page.path);
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (setting = '') => {
    setAnchorElUser(null);
    
    if (setting.path === '/login') {
      signOut(auth)
        .then(() => {
          navigate('/login');
        })
        .catch((error) => {
          console.error("Logout Error:", error);
        });
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt="Project Logo" src="https://png.pngtree.com/png-vector/20220611/ourmid/pngtree-paper-expense-report-icon-png-image_4983422.png" sx={{ width: 40, height: 40, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              BudgetBuddy
            </Typography>
          </Box>

          {user?.uid && (
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page, index) => (
                  <MenuItem key={index} onClick={() => handleCloseNavMenu(page)}>
                    <Typography sx={{ textAlign: 'center' }}>{page.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {user?.uid && (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page, index) => (
                <Button
                  key={index}
                  onClick={() => handleCloseNavMenu(page)}
                  sx={{
                    my: 2,
                    color: location.pathname === page.path ? 'yellow' : 'white', // Highlight active button
                    display: 'block',
                    padding: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', // Add a subtle hover effect
                    },
                    '&:focus': {
                      outline: 'unset'
                    }
                  }}
                >
                  <Typography variant="body1">{page.title}</Typography> {/* Use Typography for consistent styling */}
                </Button>
              ))}
            </Box>
          )}


          <Box sx={{ flexGrow: 0 }}>
            {user?.uid && (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem key={index} onClick={() => handleCloseUserMenu(setting)}>
                  <Typography sx={{ textAlign: 'center' }}>{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export { Header };
