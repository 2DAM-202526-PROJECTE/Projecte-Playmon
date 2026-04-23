import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

// Pantalles
import PantallaReproduccio from '@/features/reproductor/ui/PantallaReproduccio.jsx';
import LoginSingup from '@/features/login/LoginSingup.jsx'
import AdminDashboard from '@/features/Admin/Dashboard'
import CompteLayout from '@/features/compte/perfil/layout/CompteLayout.jsx';
import CompteInici from "@/features/compte/perfil/pages/compte/CompteInici.jsx";
import CompteInformacioPersonal from "@/features/compte/perfil/pages/compte/CompteInformacioPersonal.jsx";
import CompteSeguretat from "@/features/compte/perfil/pages/compte/CompteSeguretat.jsx";
import CompteContrasenya from "@/features/compte/perfil/pages/compte/CompteContrasenya.jsx";
import CompteConnexions from "@/features/compte/perfil/pages/compte/CompteConnexions.jsx";
import ComptePrivadesa from "@/features/compte/perfil/pages/compte/ComptePrivadesa.jsx";
import CompteLlista from "@/features/compte/perfil/pages/compte/CompteLlista.jsx";
import CompteHistorial from "@/features/compte/perfil/pages/compte/CompteHistorial.jsx";
import ComptePagaments from "@/features/compte/perfil/pages/compte/ComptePagaments.jsx";
import CompteFavorits from "@/features/compte/perfil/pages/compte/CompteFavorits.jsx";
import NotFound from '@/features/NotFound/NotFound.jsx';
import Forbidden from '@/features/Forbidden/Forbidden.jsx';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import HomeLayout from '@/features/home/HomeLayout';
import MovieDetailPage from '@/features/detail/MovieDetailPage';
import TvDetailPage from '@/features/detail/TvDetailPage';
import MoviesPage from '@/features/movies/MoviesPage';
import SeriesPage from '@/features/series/SeriesPage';
import OriginalsPage from '@/features/originals/OriginalsPage';

// Admin Pages
import AdminStats from '@/features/Admin/pages/AdminStats.jsx';
import AdminUsers from '@/features/Admin/pages/AdminUsers.jsx';
import AdminMultimedia from '@/features/Admin/pages/AdminMultimedia.jsx';
import AdminNotifications from '@/features/Admin/pages/AdminNotifications.jsx';

const App = () => {
  return (
    <Router>
      <div className="app min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 40%, #0d0a00 70%, #1a0f00 100%)' }}>
        <Routes>
          <Route path="/"
            element={<ProtectedRoute element={<HomeLayout />} />}
          />
          <Route path="/movie/:id"
            element={<ProtectedRoute element={<MovieDetailPage />} />}
          />
          <Route path="/tv/:id"
            element={<ProtectedRoute element={<TvDetailPage />} />}
          />
          <Route path="/pelicules"
            element={<ProtectedRoute element={<MoviesPage />} />}
          />
          <Route path="/series"
            element={<ProtectedRoute element={<SeriesPage />} />}
          />
          <Route path="/originals"
            element={<ProtectedRoute element={<OriginalsPage />} />}
          />

          <Route path="/compte" element={<ProtectedRoute element={<CompteLayout />} />}>
            <Route index element={<Navigate to="inici" replace />} />
            <Route path="inici" element={<CompteInici />} />
            <Route path="informacio-personal" element={<CompteInformacioPersonal />} />
            <Route path="seguretat" element={<CompteSeguretat />} />
            <Route path="contrasenya" element={<CompteContrasenya />} />
            <Route path="connexions" element={<CompteConnexions />} />
            <Route path="privadesa" element={<ComptePrivadesa />} />
            <Route path="llista" element={<CompteLlista />} />
            <Route path="historial" element={<CompteHistorial />} />
            <Route path="pagaments" element={<ComptePagaments />} />
            <Route path="favorits" element={<CompteFavorits />} />
          </Route>

          <Route path="/login"
            element={<LoginSingup />}
          />
          <Route path="/dashboard" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}>
            <Route index element={<Navigate to="stats" replace />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="multimedia" element={<AdminMultimedia />} />
            <Route path="notificacions" element={<AdminNotifications />} />
          </Route>

          <Route path='/reproduccio/:id' element={<PantallaReproduccio />} />
          <Route path='/watch' element={<ProtectedRoute element={<PantallaReproduccio />} />} />

          <Route path="/play" element={<ProtectedRoute element={<PantallaReproduccio />} />}>
            <Route path=":videoId" element={<PantallaReproduccio />} />
            <Route path="trailer/:videoId" element={<PantallaReproduccio />} />
          </Route>

          <Route path="/403" element={<Forbidden />} />

          {/* Catch-all 404 route - must be last */}
          <Route path="*" element={<NotFound />} />

          {/* <Route path='/plan_subscripcio'
            element={<FluxSubscripcio/>} 
          /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;