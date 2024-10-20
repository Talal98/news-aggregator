import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './containers/Home/Home';
import Settings from './containers/Settings/Settings';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
