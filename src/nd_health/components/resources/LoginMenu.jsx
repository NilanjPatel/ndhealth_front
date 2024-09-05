// LoginMenu.jsx

import React, { useState } from 'react';
import {
    Typography,  Paper,
    Menu, MenuItem,  Button, IconButton, Modal, TextField, Box, 
  } from '@mui/material';import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_PATH from '../../apiConfig';


const LoginMenu = ({ username }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [password, setPassword] = useState('');
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [home, setHome] = useState('');
    const [clinicWebsite, setClinicWebsite] = useState('');
    const [locationsData, setLocations] = useState();
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');
    // const [username, setUsername] = useState('');
    const { clinicSlug } = useParams();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuCloseInternal = () => {
        setAnchorEl(null);
        // onMenuClose();
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLoginClick = () => {
        // Handle login logic or navigate to login page
        // You can use React Router's history.push('/login') to navigate to the login page
        setLoginModalOpen(true);

    };
    const handleLoginModalClose = () => {
        setLoginModalOpen(false);
        setLoginMessage('');
        // Clear username and password if needed
        // setUsername('');
        // setPassword('');
      };

    const handleLogout = () => {
        // Implement logout logic here
        setLoggedIn(false);
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('accessToken');
        navigate(`/clinic/${clinicSlug}`);
    };
    const handleLogin = async () => {
        try {
          const response = await axios.post(`${API_BASE_PATH}/token-auth/`, {
            username,
            password,
          });
          const accessToken = response.data.token;
          // Store the token in local storage or state for future requests
          localStorage.setItem('accessToken', accessToken);
          // Redirect or update UI as needed
          setLoginMessage('Login successful!');
          setLoginModalOpen(false);
          setAnchorEl(null);
          setLoggedIn(true);
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('username', username);
          // window.location.reload();
        } catch (error) {
          console.error('Login failed:', error);
          setLoginMessage('Login unsuccessful!');
        }
      };


    


    return (
        <div>
            <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircleIcon />
            </IconButton>
            <Menu
                id="login-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuCloseInternal}

            >
                {loggedIn ? (
                    <>
                        {/* onClick={handleMenuCloseInternal} */}
                        <MenuItem >{`${username}`}</MenuItem> 
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        {/* Add more menu items for authenticated users if needed */}
                    </>
                ) : (
                    <MenuItem key="login" onClick={handleLoginClick}>Clinic Login</MenuItem>

                    // <MenuItem onClick={() => { onMenuClose(); handleLoginClick(); }}>Clinic Login</MenuItem>
                    // Add more menu items for other authentication options if needed
                )}
            </Menu>

            <>
                {/* Login Modal */}
                <Modal
                    open={loginModalOpen}
                    onClose={handleLoginModalClose}
                    aria-labelledby="login-modal"
                    aria-describedby="login-modal-description"
                >
                    <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 3, width: 300 }}>
                        <Typography variant="h6" gutterBottom>
                            Login
                        </Typography>
                        <TextField
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={username}
                            // onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button variant="contained" color="primary" onClick={handleLogin}>
                            Login
                        </Button>
                        <Box mt={2}>
                            <Typography variant="body2" color={loginMessage.includes('failed') ? 'error' : 'success'}>
                                {loginMessage}
                            </Typography>
                        </Box>
                    </Paper>
                </Modal></>
        </div>

    );
};

export default LoginMenu;
