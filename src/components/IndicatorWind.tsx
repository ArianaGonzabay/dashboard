import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { AirOutlined } from '@mui/icons-material';

interface WindProps {
  windSpeed: number;
  windGust: number;
  windDirection: string;
}

const IndicatorWind: React.FC<WindProps> = ({ windSpeed, windGust, windDirection }) => {
  return (
    <Box className="indicatorWind" sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            <AirOutlined sx={{ mr: 1 }} />
            Viento
          </Typography>
        </Grid>
        
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="textSecondary">
            Velocidad
          </Typography>
          <Typography variant="body1">
            {windSpeed} km/h
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant="subtitle2" color="textSecondary">
            Ráfagas
          </Typography>
          <Typography variant="body1">
            {windGust} km/h
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant="subtitle2" color="textSecondary">
            Dirección
          </Typography>
          <Typography variant="body1">
            {windDirection}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IndicatorWind;