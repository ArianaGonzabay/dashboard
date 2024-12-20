import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { LocationOnOutlined } from '@mui/icons-material';

interface LocationProps {
  latitude: number;
  longitude: number;
  altitude: number;
}

const IndicatorLocation: React.FC<LocationProps> = ({ latitude, longitude, altitude }) => {
  return (
    <Box className="indicatorLocation" sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" component="div" className='greeting-title'>
            <LocationOnOutlined sx={{ mr: 1 }} />
            Ubicación
          </Typography>
        </Grid>
        
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="textSecondary">
            Latitud
          </Typography>
          <Typography variant="body1">
            {latitude.toFixed(2)}°
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant="subtitle2" color="textSecondary">
            Longitud
          </Typography>
          <Typography variant="body1">
            {longitude.toFixed(2)}°
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant="subtitle2" color="textSecondary">
            Altitud
          </Typography>
          <Typography variant="body1">
            {altitude} m
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IndicatorLocation;