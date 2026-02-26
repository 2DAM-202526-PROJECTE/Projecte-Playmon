import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
// Pantalles
import HomeScreen from '@/screens/home/Home.jsx'
import LoginSingup from '@/screens/login/LoginSingup.jsx'
import AdminDashboard from '@/screens/Admin/Dashboard.jsx'
import CompteLayout from '@/features/compte/perfil/routes/CompteLayout.jsx';
import CompteInici from "@/features/compte/perfil/pages/compte/CompteInici.jsx";
import CompteInformacioPersonal from "@/features/compte/perfil/pages/compte/CompteInformacioPersonal.jsx";
import CompteSeguretat from "@/features/compte/perfil/pages/compte/CompteSeguretat.jsx";
import CompteContrasenya from "@/features/compte/perfil/pages/compte/CompteContrasenya.jsx";
import CompteConnexions from "@/features/compte/perfil/pages/compte/CompteConnexions.jsx";
import ComptePrivadesa from "@/features/compte/perfil/pages/compte/ComptePrivadesa.jsx";
import ComptePagaments from "@/features/compte/perfil/pages/compte/ComptePagaments.jsx";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/"
            element={<LoginSingup />}
          />
          
          <Route path="/compte" element={<CompteLayout />}>
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
            element={<AdminDashboard />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;