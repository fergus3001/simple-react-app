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
import { weatherService } from '../services/api';

function WeatherForecast() {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await weatherService.getForecasts();
        setForecasts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to load weather data');
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

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