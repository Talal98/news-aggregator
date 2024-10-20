import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import AppRoutes from './routes';

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <AppRoutes />
    </LocalizationProvider>
  );
};

export default App;
