// App.js
import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';
// Pantalles
import HomeScreen from './screens/home/Home.jsx'
import PerfilScreen from './screens/perfil/Perfil.jsx'
import LoginSingup from './screens/login/LoginSingup.jsx'

const App = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/"
                        element={<HomeScreen/>} 
                    />
                    <Route path="/perfil"
                        element={<PerfilScreen/>} 
                    />
                    <Route path="/login"
                        element={<LoginSingup/>} 
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;