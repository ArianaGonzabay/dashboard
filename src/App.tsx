import Grid from '@mui/material/Grid2'
import './App.css'
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import Item from './interface/Item';

import { useEffect, useState } from 'react';

interface Indicator {
  title?: string;
  subtitle?: string;
  value?: string;
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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Funcion para el saludo
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Buenos días";
    if (hour >= 12 && hour < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  //Funcion para convertir Kelvin a Celsius
  const kelvinToCelsius = (kelvin: string): string => {
    if (!kelvin) return '';
    const celsius = parseFloat(kelvin) - 273.15;
    return celsius.toFixed(1);
  };

  const formatDate = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  // Actualizar tiempo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

        {/* 
            Análisis, extracción y almacenamiento del contenido del XML 
            en el arreglo de resultados
        */}
        //Indicadores
        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        dataToIndicators.push({ "title": "Ciudad", "value": name });

        let location = xml.getElementsByTagName("location")[1]

        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Latitud", "value": latitude });

        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Longitud", "value": longitude });

        let altitude = location.getAttribute("altitude") || ""
        dataToIndicators.push({ "title": "Altitud", "value": altitude });
        
        //Extracción de atributos
        let times = xml.getElementsByTagName("time");

        for (let i=0; i<times.length; i++){
          let time = times[i];

          const dateStart = time.getAttribute("from")?.split("T")[1] || "";
          const dateEnd = time.getAttribute("to")?.split("T")[1] || "";

          const precipitation = time.getElementsByTagName("precipitation")[0];
          const probability = precipitation?.getAttribute("probability") || "";

          const humidity = time.getElementsByTagName("humidity")[0];
          const value = humidity.getAttribute("value") || "";

          const clouds = time.getElementsByTagName("clouds")[0];
          const all = clouds.getAttribute("all") || "";
          const cloudDescription = time.getElementsByTagName("clouds")[0]?.getAttribute("name") || "";

          const temperature = time.getElementsByTagName("temperature")[0]?.getAttribute("value") || "";
          const temperatureMin = time.getElementsByTagName("temperature")[0]?.getAttribute("min") || "";
          const temperatureMax = time.getElementsByTagName("temperature")[0]?.getAttribute("max") || "";

          const windSpeed = time.getElementsByTagName("windSpeed")[0]?.getAttribute("mps") || "";
          const windGust = time.getElementsByTagName("windGust")[0]?.getAttribute("gust") || "";
          const windDirection = time.getElementsByTagName("windDirection")[0]?.getAttribute("name") || "";
          
          const pressure = time.getElementsByTagName("pressure")[0]?.getAttribute("value") || "";

          dataToItems.push({
            dateStart,
            dateEnd,
            precipitation: probability,
            humidity: value,
            clouds: all,
            cloudDescription,
            temperature: kelvinToCelsius(temperature),
            temperatureMin: kelvinToCelsius(temperatureMin),
            temperatureMax: kelvinToCelsius(temperatureMax),
            windSpeed,
            windGust,
            windDirection,
            pressure
        });
        }

        // Indicadores de temperatura, viento y presión 
        if (times.length > 0) {
          const firstTime = times[0];

          const temperature = firstTime.getElementsByTagName("temperature")[0]?.getAttribute("value") || "";
          const temperatureMin = firstTime.getElementsByTagName("temperature")[0]?.getAttribute("min") || "";
          const temperatureMax = firstTime.getElementsByTagName("temperature")[0]?.getAttribute("max") || "";
          dataToIndicators.push({ "title": "Temperatura", "value": `${kelvinToCelsius(temperature)}°C` });
          dataToIndicators.push({ "title": "Temperatura Mínima", "value": `${kelvinToCelsius(temperatureMin)}°C` });
          dataToIndicators.push({ "title": "Temperatura Máxima", "value": `${kelvinToCelsius(temperatureMax)}°C` });

          const windSpeed = firstTime.getElementsByTagName("windSpeed")[0]?.getAttribute("mps") || "";
          const windGust = firstTime.getElementsByTagName("windGust")[0]?.getAttribute("gust") || "";
          const windDirection = firstTime.getElementsByTagName("windDirection")[0]?.getAttribute("name") || "";
          dataToIndicators.push({ "title": "Velocidad del viento", "value": windSpeed });
          dataToIndicators.push({ "title": "Ráfaga de viento", "value": windGust });
          dataToIndicators.push({ "title": "Dirección del viento", "value": windDirection });

          const pressure = firstTime.getElementsByTagName("pressure")[0]?.getAttribute("value") || "";
          dataToIndicators.push({ "title": "Presión", "value": pressure });
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
    const indicatorsWithGreeting = [
      { 
        "title": getGreeting(), 
        "subtitle": currentTime.toLocaleTimeString('es-EC', { hour12: false }),
        "value": formatDate(currentTime)
      },
      ...indicators //Añade los indicadores del clima después del saludo
    ];
  
    return indicatorsWithGreeting.map(
      (indicator, idx) => (
        <Grid 
          key={idx} 
          size={{ 
            xs: 12, 
            xl: indicator.title === getGreeting() ? 12 : 3 
          }}
        >
          <IndicatorWeather
            title={indicator["title"]}
            subtitle={indicator["subtitle"]}
            value={indicator["value"]} 
          />
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