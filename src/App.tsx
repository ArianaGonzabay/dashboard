import Grid from "@mui/material/Grid";
import "./App.css";
//import IndicatorWeather from "./components/IndicatorWeather";
import TableWeather from "./components/TableWeather";
import ControlWeather from "./components/ControlWeather";
import LineChartWeather from "./components/LineChartWeather";
import Item from "./interface/Item";
import IndicatorWind from "./components/IndicatorWind";
import IndicatorLocation from "./components/IndicatorLocation";
import IndicatorAtmosphere from "./components/IndicatorAtmosphere";

import { useEffect, useState } from "react";
import GreetingCard from "./components/GreetingCard";

interface Indicator {
  title?: string;
  subtitle?: string;
  value?: string;
}

function App() {
  let [city, setCity] = useState<string>("Guayaquil");
  let [searchCity, setSearchCity] = useState<string>("Guayaquil");
  let [indicators, setIndicators] = useState<Indicator[]>([]);
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"));
  let [items, setItems] = useState<Item[]>([]);
  let [selectedVariable, setSelectedVariable] = useState<string>("humidity");
  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  //Funcion para convertir Kelvin a Celsius
  const kelvinToCelsius = (kelvin: string): string => {
    if (!kelvin) return "";
    const celsius = parseFloat(kelvin) - 273.15;
    return celsius.toFixed(1);
  };

  // Actualizar tiempo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  {
    /* Hook: useEffect */
  }
  useEffect(() => {
    let isMounted = true;

    const fetchWeatherData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Limpia los datos anteriores
        setIndicators([]);
        setItems([]);

        let API_KEY = "c545219142fde94975c406684e0add19";
        let response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&mode=xml&appid=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - Ciudad no encontrada`);
        }

        let savedTextXML = await response.text();

        {
          /* XML Parser */
        }
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        {
          /* Arreglo para agregar los resultados */
        }
        let dataToIndicators: Indicator[] = [];
        let dataToItems: Item[] = [];

        {
          /* 
            Análisis, extracción y almacenamiento del contenido del XML 
            en el arreglo de resultados
        */
        }
        //Indicadores
        let name = xml.getElementsByTagName("name")[0].innerHTML || "";

        let location = xml.getElementsByTagName("location")[1];

        let latitude = location.getAttribute("latitude") || "";
        dataToIndicators.push({ title: "Latitud", value: latitude });

        let longitude = location.getAttribute("longitude") || "";
        dataToIndicators.push({ title: "Longitud", value: longitude });

        let altitude = location.getAttribute("altitude") || "";
        dataToIndicators.push({ title: "Altitud", value: altitude });

        //Extracción de atributos
        const times = xml.getElementsByTagName("time");

for (let i = 0; i < times.length; i++) {
    let time = times[i];

    const dateStart = time.getAttribute("from")?.split("T")[1] || "";
    const dateEnd = time.getAttribute("to")?.split("T")[1] || "";

    const precipitation = time.getElementsByTagName("precipitation")[0];
    const probability = precipitation?.getAttribute("probability") || "";

    const humidity = time.getElementsByTagName("humidity")[0];
    const humidityValue = humidity.getAttribute("value") || "";

    const clouds = time.getElementsByTagName("clouds")[0];
    const all = clouds.getAttribute("all") || "";
    const cloudDescription = clouds.getAttribute("value") || "";

    const temperature = time.getElementsByTagName("temperature")[0];
    const tempValue = temperature.getAttribute("value") || "";
    const tempMin = temperature.getAttribute("min") || "";
    const tempMax = temperature.getAttribute("max") || "";

    const windSpeed = time.getElementsByTagName("windSpeed")[0];
    const windSpeedValue = windSpeed?.getAttribute("mps") || "";
    
    const windGust = time.getElementsByTagName("windGust")[0];
    const windGustValue = windGust?.getAttribute("gust") || "";
    
    const windDirection = time.getElementsByTagName("windDirection")[0];
    const windDirectionValue = windDirection?.getAttribute("name") || "";

    const pressure = time.getElementsByTagName("pressure")[0];
    const pressureValue = pressure?.getAttribute("value") || "";

    const visibility = time.getElementsByTagName("visibility")[0];
    const visibilityValue = visibility?.getAttribute("value") || "";

    dataToItems.push({
        dateStart,
        dateEnd,
        precipitation: probability,
        humidity: humidityValue,
        clouds: all,
        cloudDescription,
        temperature: kelvinToCelsius(tempValue),
        temperatureMin: kelvinToCelsius(tempMin),
        temperatureMax: kelvinToCelsius(tempMax),
        windSpeed: windSpeedValue,
        windGust: windGustValue,
        windDirection: windDirectionValue,
        pressure: pressureValue,
        visibility: visibilityValue,
    });
}

        // Indicadores de temperatura, viento y presión
        if (times.length > 0) {
          const firstTime = times[0];

          const temperature =
            firstTime
              .getElementsByTagName("temperature")[0]
              ?.getAttribute("value") || "";
          const temperatureMin =
            firstTime
              .getElementsByTagName("temperature")[0]
              ?.getAttribute("min") || "";
          const temperatureMax =
            firstTime
              .getElementsByTagName("temperature")[0]
              ?.getAttribute("max") || "";
          dataToIndicators.push({
            title: "Temperatura",
            value: `${kelvinToCelsius(temperature)}°C`,
          });
          dataToIndicators.push({
            title: "Temperatura Mínima",
            value: `${kelvinToCelsius(temperatureMin)}°C`,
          });
          dataToIndicators.push({
            title: "Temperatura Máxima",
            value: `${kelvinToCelsius(temperatureMax)}°C`,
          });

          const windSpeed =
            firstTime
              .getElementsByTagName("windSpeed")[0]
              ?.getAttribute("mps") || "";
          const windGust =
            firstTime
              .getElementsByTagName("windGust")[0]
              ?.getAttribute("gust") || "";
          const windDirection =
            firstTime
              .getElementsByTagName("windDirection")[0]
              ?.getAttribute("name") || "";
          dataToIndicators.push({
            title: "Velocidad del viento",
            value: windSpeed,
          });
          dataToIndicators.push({ title: "Ráfaga de viento", value: windGust });
          dataToIndicators.push({
            title: "Dirección del viento",
            value: windDirection,
          });

          const pressure =
            firstTime
              .getElementsByTagName("pressure")[0]
              ?.getAttribute("value") || "";
          dataToIndicators.push({ title: "Presión", value: pressure });
        }

        //6 primeros elementos
        const firstSix = dataToItems.slice(0, 6);

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
    };

    // Solo hacer fetch si hay una ciudad para buscar
    if (searchCity) {
      fetchWeatherData();
    }

    // Función de limpieza
    return () => {
      isMounted = false;
    };
  }, [searchCity]);

  //Cambiar ciudad con un input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  // Manejar búsqueda
  const handleSearch = () => {
    setSearchCity(city);
  };

  let renderIndicators = () => {
    return (
      <>
        {/* Componente de Viento */}
        <Grid item xs={12} xl={3}>
          <IndicatorWind
            windSpeed={getWeatherData().windSpeed || 0}
            windGust={getWeatherData().windGust || 0}
            windDirection={getWeatherData().windDirection || 'N/A'}
          />
        </Grid>
  
        {/* Componente de Ubicación */}
        <Grid item xs={12} xl={3}>
          <IndicatorLocation
            latitude={getWeatherData().latitude || 0}
            longitude={getWeatherData().longitude || 0}
            altitude={getWeatherData().altitude || 0}
          />
        </Grid>
  
        {/* Indicador de condiciones atmosféricas */}
        <Grid item xs={12} sm={6} md={4}>
          <IndicatorAtmosphere
            pressure={getWeatherData().pressure}
            humidity={getWeatherData().humidity}
            visibility={getWeatherData().visibility || 0}
          />
        </Grid>
      </>
    );
  };
  
  const getWeatherData = () => {
    console.log("Todos los indicadores:", indicators);
    
    const temp = indicators.find(i => i.title === "Temperatura");
    const tempMin = indicators.find(i => i.title === "Temperatura Mínima");
    const tempMax = indicators.find(i => i.title === "Temperatura Máxima");
    
    console.log("Temperatura:", temp);
    console.log("Mínima:", tempMin);
    console.log("Máxima:", tempMax);
    
    const windSpeed = indicators.find(i => i.title === "Velocidad del viento");
    const windGust = indicators.find(i => i.title === "Ráfaga de viento");
    const windDirection = indicators.find(i => i.title === "Dirección del viento");

    const latitude = indicators.find(i => i.title === "Latitud");
    const longitude = indicators.find(i => i.title === "Longitud");
    const altitude = indicators.find(i => i.title === "Altitud");

    const pressure = indicators.find(i => i.title === "Presión");
    const humidity = indicators.find(i => i.title === "Humedad");
    const visibility = indicators.find(i => i.title === "Visibilidad");

    return {
      temperature: temp?.value?.replace('°C', '') || '',
      temperatureMin: tempMin?.value?.replace('°C', '') || '',
      temperatureMax: tempMax?.value?.replace('°C', '') || '',
      windSpeed: parseFloat(windSpeed?.value || '0'),
      windGust: parseFloat(windGust?.value || '0'),
      windDirection: windDirection?.value || '',
      latitude: parseFloat(latitude?.value || '0'),
      longitude: parseFloat(longitude?.value || '0'),
      altitude: parseFloat(altitude?.value || '0'),
      humidity: parseFloat(humidity?.value || '0'),
      visibility: parseFloat(visibility?.value || '0'),
      pressure: parseFloat(pressure?.value || '0')
    };
  };
  {
    /* JSX */
  }
  return (
    <Grid container spacing={5}>
      {/* Input para cambiar la ciudad */}
      <Grid
        xs={12}
        xl={12}
        sx={{ display: "flex", alignItems: "center", gap: 2 }}
      >
        <div className="inicio-container">
          <h1 className="title">Forecast Weather Ecuador</h1>
          <p className="description">
    Descubre el clima actual y pronósticos detallados de cualquier ciudad en Ecuador. Escribe el nombre de una ciudad en el buscador y presiona Enter para obtener información actualizada.
  </p>
          <div className="search-container">
            <input
              type="text"
              value={city}
              onChange={handleInputChange}
              /*permitir hacer enter*/
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Ingrese la ciudad"
              className="city-input"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="search-button"
            >
              {isLoading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>
      </Grid>

      {/* Manejo de errores */}
      {error && (
  <Grid item xs={12} xl={12}>
          <p style={{ color: "red" }}>{error}</p>
        </Grid>
      )}

      {isLoading ? (
  <Grid item xs={12} xl={12}>
          <p>Cargando datos...</p>
        </Grid>
      ) : (
        <>
        <Grid item xs={12} xl={12} >
        {/*Fila de indicadores*/}
        <h2>Indicadores</h2>
        <Grid item container xs={12} spacing={2} >
          
          {/* GreetingCard */}
          <Grid item xs={12} sm={6} md={3}>
            <GreetingCard
              currentTime={currentTime}
              city={city}
              {...getWeatherData()}
            />
          </Grid>

          {/* IndicatorWind */}
          <Grid item xs={12} sm={6} md={3}>
            <IndicatorWind
              windSpeed={getWeatherData().windSpeed || 0}
              windGust={getWeatherData().windGust || 0}
              windDirection={getWeatherData().windDirection || 'N/A'}
            />
          </Grid>

          {/* IndicatorLocation */}
          <Grid item xs={12} sm={6} md={3} >
            <IndicatorLocation
              latitude={getWeatherData().latitude || 0}
              longitude={getWeatherData().longitude || 0}
              altitude={getWeatherData().altitude || 0}
            />
          </Grid>

          {/* IndicatorAtmosphere */}
          <Grid item xs={12} sm={6} md={3}>
            <IndicatorAtmosphere
              pressure={getWeatherData().pressure}
              humidity={getWeatherData().humidity}
              visibility={getWeatherData().visibility || 0}
            />
          </Grid>
        </Grid>
        </Grid>

          {/* Tabla */}
          <Grid item container xs={12} spacing={2}>
          <Grid item xs={12} xl={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} xl={3}>
                <ControlWeather
                  selectedVariable={selectedVariable}
                  onVariableChange={setSelectedVariable}
                />
              </Grid>
              <Grid item xs={12} xl={9}>
                <TableWeather itemsIn={items} />
              </Grid>
            </Grid>
          </Grid>

          {/* Gráfico */}
          <Grid item xs={12} xl={4}>
            <LineChartWeather data={items} variable={selectedVariable} />
          </Grid>
        </Grid>
      </>
    )}
  </Grid>
);
}

export default App;
