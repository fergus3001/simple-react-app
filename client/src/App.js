import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Paper,
    Avatar,
    Menu,
    MenuItem
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';  // New way for v4.0.0+
import { useAuth } from './contexts/AuthContext';

function App() {
    const { user, login, logout } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <HomeIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        My React App
                    </Typography>

                    {user ? (
                        <>
                            <Box display="flex" alignItems="center">
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                    {user.name}
                                </Typography>
                                <Avatar
                                    src={user.picture}
                                    alt={user.name}
                                    onClick={handleMenuClick}
                                    sx={{ cursor: 'pointer' }}
                                />
                            </Box>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                const decoded = jwtDecode(credentialResponse.credential);
                                login(decoded);
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            useOneTap
                        />
                    )}
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome{user ? `, ${user.given_name}` : ' to My React App'}
                    </Typography>

                    <Typography variant="body1" paragraph>
                        This is a simple React application using Material UI components with Google SSO.
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Feature One
                                    </Typography>
                                    <Typography variant="body2">
                                        This is a sample feature card demonstrating MUI components.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h5" component="div">
                                    Feature Two
                                </Typography>
                                <Typography variant="body2">
                                    Another example using Paper component instead of Card.
                                </Typography>
                                <Box mt={2}>
                                    <Button variant="contained" color="primary">
                                        Learn More
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}

export default App;