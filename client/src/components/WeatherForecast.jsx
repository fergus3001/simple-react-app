import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { useAuth } from '../contexts/AuthContext';
import { weatherService } from '../services/api';

function WeatherForecast() {
  const { token } = useAuth();
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Reset state when token changes
  useEffect(() => {
    //console.log("Token changed:", token);
    // Reset state when token changes
    setLoading(true);
    setError(null);
    
    // Clear forecasts on logout
    if (!token) {
      setForecasts([]);
    }
  }, [token]);
  
  // Separate effect for data fetching
  useEffect(() => {
    let isMounted = true;
    
    const fetchWeatherData = async () => {
      // Skip fetch if not authenticated
      if (!token) {
        if (isMounted) {
          setError('Authentication required');
          setLoading(false);
        }
        return;
      }
      
      try {
        const response = await weatherService.getForecasts();
        if (isMounted) {
          setForecasts(response.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching weather data:', err);
        if (isMounted) {
          if (err.response && err.response.status === 401) {
            setError('Unauthorized: Please log in');
          } else {
            setError('Failed to load weather data');
          }
          setLoading(false);
        }
      }
    };

    fetchWeatherData();
    
    // Clean up function
    return () => {
      isMounted = false;
    };
  }, [token]); // Depend on token to refetch when it changes

  // Choose icon based on temperature
  const getWeatherIcon = (temperatureC) => {
    if (temperatureC > 25) return <WbSunnyIcon />;
    if (temperatureC < 0) return <AcUnitIcon />;
    return <ThunderstormIcon />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!token) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Weather Forecast
          </Typography>
          <Typography color="error" paragraph>
            Please login to view weather forecasts
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Weather Forecast
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Data from .NET Core API
        </Typography>
        
        <List>
          {forecasts.map((forecast, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {getWeatherIcon(forecast.temperatureC)}
              </ListItemIcon>
              <ListItemText
                primary={new Date(forecast.date).toLocaleDateString()}
                secondary={`${forecast.temperatureC}°C / ${forecast.temperatureF}°F - ${forecast.summary}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default WeatherForecast;