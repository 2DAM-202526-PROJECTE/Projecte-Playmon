// App.js
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
// Pantalles
import PerfilScreen from './screens/perfil/Perfil.jsx'
import LoginSingup from './screens/login/LoginSingup.jsx'
import AdminDashboard from './screens/Admin/Dashboard.jsx'
import Header from './components/Header.jsx'
import Slider from './components/Slider.jsx'
import ProductionHous from './components/ProductionHous.jsx'
import GenreMovieList from './components/GenreMovieList.jsx'

const App = () => {
  return (
    <Router>
      <div className="app min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 40%, #0d0a00 70%, #1a0f00 100%)' }}>
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Slider />
              <ProductionHous />
              <GenreMovieList />
            </>
          } />
          <Route path="/perfil" element={<PerfilScreen />} />
          <Route path="/login" element={<LoginSingup />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;