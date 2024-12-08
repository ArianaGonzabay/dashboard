{/* Componentes MUI */}
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// Define props interface
interface ControlWeatherProps {
    selectedVariable: string;
    onVariableChange: (variable: string) => void;
}

export default function ControlWeather({ 
    selectedVariable, 
    onVariableChange 
}: ControlWeatherProps) {
    {/* Arreglo de objetos */}
    const items = [
        {"name":"Precipitación", "description":"Cantidad de agua que cae sobre una superficie en un período específico.", "value": "precipitation"},
        {"name": "Humedad", "description":"Cantidad de vapor de agua presente en el aire, generalmente expresada como un porcentaje.", "value": "humidity"},
        {"name":"Nubosidad", "description":"Grado de cobertura del cielo por nubes, afectando la visibilidad y la cantidad de luz solar recibida.", "value": "clouds"}
    ];

    {/* Manejador de eventos */}
    const handleChange = (event: SelectChangeEvent) => {
        const selectedValue = event.target.value;
        const selectedItem = items.find(item => item.value === selectedValue);
        
        if (selectedItem) {
            onVariableChange(selectedItem.value);
        }
    };

    {/* Obtener la descripción del elemento seleccionado */}
    const getSelectedDescription = () => {
        const selectedItem = items.find(item => item.value === selectedVariable);
        return selectedItem ? selectedItem.description : "Seleccione una variable meteorológica";
    };

    {/* JSX */}
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Typography mb={2} component="h3" variant="h6" color="primary">
                Variables Meteorológicas
            </Typography>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="simple-select-label">Variables</InputLabel>
                    <Select
                        labelId="simple-select-label"
                        id="simple-select"
                        label="Variables"
                        value={selectedVariable}
                        onChange={handleChange}
                    >
                        {items.map((item) => (
                            <MenuItem key={item.value} value={item.value}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            
            <Typography mt={2} component="p" color="text.secondary">
                {getSelectedDescription()}
            </Typography>
        </Paper>
    )
}