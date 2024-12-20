import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import Item from '../interface/Item';

interface LineChartWeatherProps {
    data: Item[];
    variable: string; 
  }

export default function LineChartWeather({ data, variable }: LineChartWeatherProps) {
    
    const chartData = data.map(item => parseFloat((item[variable as keyof Item] as string) || '0'));
    const xLabels = data.map(item => item.dateStart);
  
    return (
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}
        elevation={0}
      >
        <LineChart
          width={500}
          height={300}
          series={[
            { data: chartData, label: variable.toUpperCase() },
          ]}
          xAxis={[{ scaleType: 'point', data: xLabels }]}
        />
      </Paper>
    );
  }