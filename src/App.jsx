import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

// Pantalles
<<<<<<< HEAD
import PerfilScreen from './screens/perfil/Perfil.jsx'
import LoginSingup from './screens/login/LoginSingup.jsx'
import AdminDashboard from './screens/Admin/Dashboard.jsx'
import Header from './components/Header.jsx'
import Slider from './components/Slider.jsx'
import ProductionHous from './components/ProductionHous.jsx'
import GenreMovieList from './components/GenreMovieList.jsx'
=======
import LoginSingup from '@/features/login/LoginSingup.jsx'
import AdminDashboard from '@/features/Admin/Dashboard'
import CompteLayout from '@/features/compte/perfil/routes/CompteLayout.jsx';
import CompteInici from "@/features/compte/perfil/pages/compte/CompteInici.jsx";
import CompteInformacioPersonal from "@/features/compte/perfil/pages/compte/CompteInformacioPersonal.jsx";
import CompteSeguretat from "@/features/compte/perfil/pages/compte/CompteSeguretat.jsx";
import CompteContrasenya from "@/features/compte/perfil/pages/compte/CompteContrasenya.jsx";
import CompteConnexions from "@/features/compte/perfil/pages/compte/CompteConnexions.jsx";
import ComptePrivadesa from "@/features/compte/perfil/pages/compte/ComptePrivadesa.jsx";
import ComptePagaments from "@/features/compte/perfil/pages/compte/ComptePagaments.jsx";
import NotFound from '@/features/NotFound/NotFound.jsx';
import Forbidden from '@/features/Forbidden/Forbidden.jsx';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Header from './components/Header';
import Slider from './components/Slider';
import ProductionHous from './components/ProductionHous';
>>>>>>> a502eaaa848adcdb170ca025494b58b715a6272f

const App = () => {
  return (
    <Router>
      <div className="app min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 40%, #0d0a00 70%, #1a0f00 100%)' }}>
        <Routes>
<<<<<<< HEAD
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
=======
          <Route path="/"
            element={
              <ProtectedRoute element={
                <>
                  <Header />
                  <Slider />
                  <ProductionHous />
                </>
              } />
            }
          />
          
          <Route path="/compte" element={<ProtectedRoute element={<CompteLayout />} />}>
            <Route index element={<Navigate to="inici" replace />} />
            <Route path="inici" element={<CompteInici />} />
            <Route path="informacio-personal" element={<CompteInformacioPersonal />} />
            <Route path="seguretat" element={<CompteSeguretat />} />
            <Route path="contrasenya" element={<CompteContrasenya />} />
            <Route path="connexions" element={<CompteConnexions />} />
            <Route path="privadesa" element={<ComptePrivadesa />} />
            <Route path="pagaments" element={<ComptePagaments />} />
          </Route>

          <Route path="/login"
            element={<LoginSingup />}
          />
          <Route path="/dashboard"
            element={<Navigate to="/dashboard/users" replace />}
          />
          <Route path="/dashboard/users"
            element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}
          />
          <Route path="/dashboard/admins"
            element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}
          />
          <Route path="/dashboard/videos"
            element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}
          />
          <Route path="/dashboard/public-videos"
            element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}
          />

          <Route path="/403" element={<Forbidden />} />
          
          {/* Catch-all 404 route - must be last */}
          <Route path="*" element={<NotFound />} />
>>>>>>> a502eaaa848adcdb170ca025494b58b715a6272f
        </Routes>
      </div>
    </Router>
  );
};

export default App;