import React, {useState, useEffect} from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate} from "react-router-dom";
import ndHealthLogo from '../../nd-health-logo.png';
import {makeStyles} from "@mui/styles";

import {createTheme, ThemeProvider} from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
    appBar: {
        backdropFilter: 'blur(10px)', // Creates the blur effect
        backgroundColor: 'rgba(232,215,215,0.3)', // Semi-transparent white
        transition: 'all 0.3s ease-in-out',
        borderRadius: '1rem',
        // border: '2px solid transparent',
        position: 'sticky',
        left: '50%', // Center horizontally


    },
    stickyAppBar: {
        position: 'sticky',
        top: 0,
        zIndex: 1100, // Ensure it's above other content

    },
    toolbar: {
        borderRadius: '1rem', zIndex: 1000, border: '1px', position: 'sticky',

    },
    logo: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
    },
}));

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: 'rgba(212,216,230,0.2)',
        },
    },
});


const CustomAppBar = ({
                          scrollToFeatures,
                          handleOpenLogin,
                          handleOpenSignup,
                          handleOpenNavMenu,
                          handleCloseNavMenu,
                      }) => {
    const navigate = useNavigate();
    const classes = useStyles();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [isSticky, setIsSticky] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 100) {
            setIsSticky(true);
        } else {
            setIsSticky(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    const goToSignup = () => {
        navigate(`/signup`);
    };

    return (
        <ThemeProvider theme={lightTheme}>

            <AppBar position="sticky" className={`${classes.appBar} ${classes.stickyAppBar}`}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters className={classes.toolbar}>
                        <img
                            src={ndHealthLogo}
                            alt="ND Health, book online family and walkin appointment"
                            style={{width: '80px', height: '80px', borderRadius: '50%'}}
                        />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                paddingRight: '1rem',
                                paddingLeft: '1rem',
                                display: {xs: 'none', md: 'flex'},
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                color: '#1975D1',
                                textDecoration: 'none',
                            }}
                        >
                            ND Health
                        </Typography>

                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: {xs: 'flex', md: 'none'},
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: '#1975D1',
                                textDecoration: 'none',
                                paddingLeft: '0.1rem',
                            }}
                        >
                            ND Health
                        </Typography>

                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            <Button
                                key="Features"
                                onClick={scrollToFeatures} // Update the click handler
                                sx={{my: 2, color: '#1975D1', display: 'block'}}
                            >
                                Features
                            </Button>
                            <Button
                                key="Login"
                                onClick={handleOpenLogin}
                                sx={{my: 2, color: '#1975D1', display: 'block'}}
                            >
                                Login
                            </Button>
                            <Button
                                key="Signup"
                                onClick={handleOpenSignup}
                                sx={{my: 2, color: '#1975D1', display: 'block'}}
                            >
                                Signup
                            </Button>

                        </Box>

                        <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon/>
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
                                sx={{
                                    display: {xs: 'block', md: 'none'},
                                }}
                            >
                                <MenuItem onClick={scrollToFeatures}>
                                    <Typography textAlign="center">Features</Typography>
                                </MenuItem>
                                <MenuItem onClick={goToSignup}>
                                    <Typography textAlign="center">Signup</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    );
};

export default CustomAppBar;
