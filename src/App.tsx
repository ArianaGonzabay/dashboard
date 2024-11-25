//import { useState } from 'react'
// Grid version 2
import Grid from '@mui/material/Grid2' 
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';

function App() {
  //const [count, setCount] = useState(0)

  return (
    <Grid container spacing={5}>


     {/* Indicadores */}
      <Grid size={{ xs: 12, xl: 3 }}>
      <IndicatorWeather title={'Indicator 1'} subtitle={'Unidad 1'} value={"1.23"} />
      </Grid> 
      <Grid size={{ xs: 12, xl: 3 }}>
      <IndicatorWeather title={'Indicator 2'} subtitle={'Unidad 2'} value={"3.12"} />
      </Grid>
      <Grid size={{ xs: 12, xl: 3 }}>
      <IndicatorWeather title={'Indicator 3'} subtitle={'Unidad 3'} value={"2.31"} />
      </Grid>
      <Grid size={{ xs: 12, xl: 3 }}>
      <IndicatorWeather title={'Indicator 4'} subtitle={'Unidad 4'} value={"3.21"} />
      </Grid>

      {/* Tabla */}
      <Grid size={{ xs: 12, xl: 8 }}>Elemento: Tabla</Grid>

      {/* Grid Anidado */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, xl: 3 }}>
          <ControlWeather/>
        </Grid>
        <Grid size={{ xs: 12, xl: 9 }}>
          <TableWeather/>
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Grid size={{ xs: 12, xl: 4 }}><LineChartWeather/></Grid>
 
    </Grid>
  )
}

export default App
