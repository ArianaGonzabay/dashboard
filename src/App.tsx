import Grid from '@mui/material/Grid2'
import './App.css'
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import Item from './interface/Item';

import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  let [city, setCity] = useState<string>("Guayaquil")
  let [searchCity, setSearchCity] = useState<string>("Guayaquil")
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))
  let [items, setItems] = useState<Item[]>([])
  let [selectedVariable, setSelectedVariable] = useState<string>("humidity");
  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState<string | null>(null);

  {/* Hook: useEffect */ }
  useEffect(() => {
    let isMounted = true;

    const fetchWeatherData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Limpia los datos anteriores
        setIndicators([]);
        setItems([]);

        let API_KEY = "c545219142fde94975c406684e0add19"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&mode=xml&appid=${API_KEY}`)
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - Ciudad no encontrada`);
        }

        let savedTextXML = await response.text();

        {/* XML Parser */ }
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        {/* Arreglo para agregar los resultados */ }
        let dataToIndicators: Indicator[] = [];
        let dataToItems: Item[] = [];

        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name })

        let location = xml.getElementsByTagName("location")[1]

        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

        let altitude = location.getAttribute("altitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })
        
        //Etiqueta time
        let times = xml.getElementsByTagName("time");

        for (let i=0; i<times.length; i++){
          let time = times[i];

          //Extracción de atributos
          const dateStart = time.getAttribute("from")?.split("T")[1] || "";
          const dateEnd = time.getAttribute("to")?.split("T")[1] || "";

          const precipitation = time.getElementsByTagName("precipitation")[0];
          const probability = precipitation?.getAttribute("probability") || "";

          const humidity = time.getElementsByTagName("humidity")[0];
          const value = humidity.getAttribute("value") || "";

          const clouds = time.getElementsByTagName("clouds")[0];
          const all = clouds.getAttribute("all") || "";

          dataToItems.push({
            dateStart,
            dateEnd,
            precipitation: probability,
            humidity: value,
            clouds: all
          });
        }

        //6 primeros elementos
        const firstSix = dataToItems.slice(0,6);
        
        if (isMounted) {
          setItems(firstSix);
          setIndicators(dataToIndicators);
          setCity(searchCity);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    // Solo hacer fetch si hay una ciudad para buscar
    if (searchCity) {
      fetchWeatherData();
    }

    // Función de limpieza
    return () => {
      isMounted = false;
    };

  }, [searchCity])

  //Cambiar ciudad con un input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value)
  }

  // Manejar búsqueda
  const handleSearch = () => {
    setSearchCity(city);
  }

  let renderIndicators = () => {
    return indicators
      .map(
        (indicator, idx) => (
          <Grid key={idx} size={{ xs: 12, xl: 3 }}>
            <IndicatorWeather
              title={indicator["title"]}
              subtitle={indicator["subtitle"]}
              value={indicator["value"]} />
          </Grid>
        )
      )
  }

  {/* JSX */ }
  return (
    <Grid container spacing={5}>
      {/* Input para cambiar la ciudad */}
      <Grid size={{ xs: 12, xl: 12 }} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Ingrese la ciudad"
          style={{ flexGrow: 1, padding: '8px' }}
        />
        <button 
          onClick={handleSearch} 
          disabled={isLoading}
          style={{ padding: '8px 16px' }}
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </Grid>

      {/* Manejo de errores */}
      {error && (
        <Grid size={{ xs: 12, xl: 12 }}>
          <p style={{ color: 'red' }}>{error}</p>
        </Grid>
      )}

      {isLoading ? (
        <Grid size={{ xs: 12, xl: 12 }}>
          <p>Cargando datos...</p>
        </Grid>
      ) : (
        <>
          {renderIndicators()}

          {/* Tabla */}
          <Grid size={{ xs: 12, xl: 8 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, xl: 3 }}>
                <ControlWeather 
                  selectedVariable={selectedVariable} 
                  onVariableChange={setSelectedVariable} 
                />
              </Grid>
              <Grid size={{ xs: 12, xl: 9 }}>
                <TableWeather itemsIn={items} />
              </Grid>
            </Grid>
          </Grid>

          {/* Gráfico */}
          <Grid size={{ xs: 12, xl: 4 }}>
            <LineChartWeather data={items} variable={selectedVariable} />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default App;