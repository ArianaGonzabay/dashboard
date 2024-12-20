import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { CloudOutlined } from '@mui/icons-material';

interface AtmosphereProps {
  pressure: number;
  humidity: number;
  visibility: number;
}

const IndicatorAtmosphere: React.FC<AtmosphereProps> = ({ 
  pressure, 
  humidity, 
  visibility 
}) => {
  return (
    <Box className="indicatorAtmosphere" sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" component="div" className='greeting-title'>
            <CloudOutlined sx={{ mr: 1 }} />
            Condiciones Atmosféricas
          </Typography>
        </Grid>
        
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="textSecondary">
            Presión
          </Typography>
          <Typography variant="body1">
            {pressure} hPa
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant="subtitle2" color="textSecondary">
            Humedad
          </Typography>
          <Typography variant="body1">
            {humidity}%
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant="subtitle2" color="textSecondary">
            Visibilidad
          </Typography>
          <Typography variant="body1">
            {visibility} km
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IndicatorAtmosphere;