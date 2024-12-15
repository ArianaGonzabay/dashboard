import Grid from '@mui/material/Grid2';

interface GreetingCardProps {
  currentTime: Date;
  city: string;
  temperature?: string;
  temperatureMin?: string;
  temperatureMax?: string;
}

const GreetingCard = ({ currentTime, city, temperature, temperatureMin, temperatureMax }: GreetingCardProps) => {
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Buenos días";
    if (hour >= 12 && hour < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  const formatDate = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

return (
    <Grid size={{ xs: 12, xl: 4 }}>
      <div className="greeting-card">
        <div className="greeting-header">
          <h2 className="greeting-title">{getGreeting()}</h2>
          <h3 className="greeting-city">{city}</h3>
        </div>
        <div className="greeting-content">
          <div className="greeting-time-section">
            <p className="greeting-time">{currentTime.toLocaleTimeString('es-EC', { hour12: false })}</p>
            <p className="greeting-date">{formatDate(currentTime)}</p>
          </div>
          <div className="greeting-weather-section">
            {temperature && (
              <p className="temperature-current">
                <span className="temperature-value">{temperature}</span>
                <span className="temperature-unit">°C</span>
              </p>
            )}
            <div className="temperature-minmax">
              {temperatureMin && (
                <p className="temperature-min">
                  Min: {temperatureMin}°C
                </p>
              )}
              {temperatureMax && (
                <p className="temperature-max">
                  Max: {temperatureMax}°C
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default GreetingCard;