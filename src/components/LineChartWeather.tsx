import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import Item from '../interface/Item';

interface LineChartWeatherProps {
    data: Item[]; // Arreglo de datos desde `App.tsx`
    variable: string; // Variable seleccionada
  }

// const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
// const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
// const xLabels = [
//     'Page A',
//     'Page B',
//     'Page C',
//     'Page D',
//     'Page E',
//     'Page F',
//     'Page G',
// ];

export default function LineChartWeather({ data, variable }: LineChartWeatherProps) {
    // Extrae datos según la variable seleccionada
    const chartData = data.map(item => parseFloat((item[variable as keyof Item] as string) || '0'));
    const xLabels = data.map(item => item.dateStart);
  
    return (
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
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