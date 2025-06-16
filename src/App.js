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
  Paper
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <HomeIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My React App
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to My React App
          </Typography>
          
          <Typography variant="body1" paragraph>
            This is a simple React application using Material UI components.
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