import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
// Pantalles
import HomeScreen from './screens/home/Home.jsx'
import PerfilScreen from './features/compte/perfil/pages/Perfil.jsx'
import LoginSingup from './screens/login/LoginSingup.jsx'
import AdminDashboard from './screens/Admin/Dashboard.jsx'

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/"
            element={<HomeScreen />}
          />
          <Route path="/perfil"
            element={<PerfilScreen />}
          />
          <Route path="/login"
            element={<LoginSingup />}
          />
          <Route path="/dashboard"
            element={<AdminDashboard />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;