import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Votre thème PrimeReact
import 'primereact/resources/primereact.min.css'; // Les styles de base de PrimeReact
import 'primeicons/primeicons.css'; // Si vous utilisez les icônes PrimeIcons
import './styles/TableauStyles.css';

import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import SideBar from './components/app/SideBar';
import Header from './components/app/Header';
import Footer from './components/app/Footer';
import RoutesContent from './routes/RoutesProvider';
import React, { useState, useEffect } from 'react'; 

import ErrorBoundary from './components/common/ErrorBoundary'; 
import { AuthProvider, useAuth } from './context/authContext';
import LoginModal from './components/LoginModal'; 

function AppLayout() {
  const { loading, user } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true);
    } else if (!loading && user) {
      setShowLoginModal(false);
      if (window.location.pathname === '/') {
        navigate('/dashboard');
      }
    }
  }, [loading, user, navigate]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginModal showModal={showLoginModal} onLoginSuccess={handleLoginSuccess} />
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="card p-5 shadow-lg" style={{width: '90%', maxWidth: '500px', border: '2px solid #dee2e6', borderRadius: '15px'}}>
            <div className="text-center mb-4">
              <i className="bi bi-lock text-primary" style={{fontSize: '4rem'}}></i>
            </div>
            <p className="h4 text-center text-muted mb-4">
              Veuillez vous connecter pour accéder au tableau de bord
            </p>
            <button 
              className="btn btn-primary w-100 py-3 d-flex align-items-center justify-content-center"
              onClick={() => setShowLoginModal(true)}
              style={{borderRadius: '10px'}}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Ouvrir la connexion
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <SideBar />
      
      {/* Contenu principal - Positionné correctement */}
      <div 
        className="flex-grow-1" 
        style={{ 
          marginLeft: '280px', 
          paddingTop: '80px', 
          minHeight: '100vh',
          width: 'calc(100% - 180px)',
          backgroundColor: '#f8f9fa',
          padding: '1.5rem'
        }}
      >
        <div 
          className="bg-white rounded-3 shadow-sm p-4 h-100"
          style={{
            border: '2px solid #dee2e6',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
          }}
        >
          <div className="mb-4 m-4">
            <h2 className="text-primary mb-0 fw-bold">
              <i className="bi bi-graph-up me-3"></i>
              Tableau de bord IoT
            </h2>
            <hr className="border-primary opacity-100 w-25" style={{height: '3px'}} />
          </div>
          
          <ErrorBoundary>
            <RoutesContent />
          </ErrorBoundary>
        </div>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  )
}

export default App;