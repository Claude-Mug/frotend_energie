import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

// Import de votre image
import sidebarImage from '../../assets/Sidebare.jpg';

// import des graphiques des data 

// Importez vos fonctions de fetch pour chaque type de capteur
import { fetchUltrasonicData } from '../../pages/ultrasonic/ListeUltrasonicPage';
import { fetchPirData } from '../../pages/pir/ListePirPage';
import { fetchDht11Data } from '../../pages/dht11/ListeDht11Page';
import { fetchLdrData } from '../../pages/ldr/ListeLdrPage';
import { fetchActionneursData } from '../../pages/actionneurs/ListeActionneursPage';
import { useAuth } from '../../context/authContext'; // Ajouter cette ligne
import { fetchUserData } from '../../pages/users/ListeUsersPage';

function SideBar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const prefetchData = (queryKey, fetchFunction) => {
    queryClient.prefetchQuery({
      queryKey: [queryKey],
      queryFn: fetchFunction,
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <div 
      className="d-flex flex-column h-100 bg-dark text-white p-2"
      style={{
        position: 'fixed', // Rend la sidebar fixe
        top: 0,
        left: 0,
        width: '280px',
        zIndex: 1000
      }}
    >
      {/* Photo de profil et titre */}
      <div className="d-flex flex-column align-items-center mb-3 mt-3">
        <div 
          className="rounded-circle overflow-hidden shadow" 
          style={{ width: '90px', height: '90px', border: '3px solid #93c5fd' }}
        >
          <img 
            src={sidebarImage} 
            alt="Profil" 
            className="w-100 h-100 object-cover"
          />
        </div>
        <div className="mt-1 text-center">
          <div className="h4 fw-bold text-white">Gestion Energie IoT</div>
          <div className="text-info">Administrateur système</div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
        <h6 className="text-uppercase text-info fw-bold mb-3 pb-2 border-bottom border-secondary">MODULES IoT</h6>
        <ul className="nav flex-column mb-4">
          <li className="nav-item mb-2">
            <Link 
              className="nav-link text-white d-flex align-items-center" 
              to="/ultrasonic/graphiques"
              onMouseEnter={() => prefetchData('ultrasonicData', fetchUltrasonicData)}
            >
              <i className="bi bi-circle me-2"></i>
              Ultrasonic (Distance)
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link 
              className="nav-link text-white d-flex align-items-center" 
              to="/pir"
              onMouseEnter={() => prefetchData('pirData', fetchPirData)}
            >
              <i className="bi bi-eye me-2"></i>
              Capteur PIR (Mouvement)
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link 
              className="nav-link text-white d-flex align-items-center" 
              to="/dht11/graphiques"
              onMouseEnter={() => prefetchData('dht11Data', fetchDht11Data)}
            >
              <i className="bi bi-sun me-2"></i>
              Température et humidité
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link 
              className="nav-link text-white d-flex align-items-center" 
              to="/ldr/graphiques"
              onMouseEnter={() => prefetchData('ldrData', fetchLdrData)}
            >
              <i className="bi bi-lightbulb me-2"></i>
              Capteur de lumiere
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link 
              className="nav-link text-white d-flex align-items-center" 
              to="/actionneurs"
              onMouseEnter={() => prefetchData('actionneursData', fetchActionneursData)}
            >
              <i className="bi bi-gear me-2"></i>
              Actionneurs
            </Link>
          </li>
          {/* Ajouter après Actionneurs */}
      {user && user.role === 'Admin' && (
        <li className="nav-item mb-2">
          <Link 
            className="nav-link text-white d-flex align-items-center" 
            to="/users"
            onMouseEnter={() => prefetchData('userData', fetchUserData)}
          >
            <i className="bi bi-people me-2"></i>
            Utilisateurs
          </Link>
        </li>
      )}
        </ul>

        <h6 className="text-uppercase text-info fw-bold mb-2 pb-2 border-bottom border-secondary">COMMANDES</h6>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link 
              className="nav-link text-white fw-bold d-flex align-items-center" 
              to="/dashboard"
            >
              <i className="bi bi-play-btn text-info me-2"></i>
              Tableau des commandes
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;