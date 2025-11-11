import React from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleHome = () => {
    navigate('/dashboard');
  };

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm border-bottom border-2 border-primary py-3"
      style={{
        left: '280px', // Commence après la sidebar
        width: 'calc(100% - 280px)', // Prend le reste de la largeur
        zIndex: 1001 // Doit être au-dessus de la sidebar
      }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <i className="bi bi-wifi text-primary fs-2 me-3"></i>
          <span className="navbar-brand mb-0 h1 fw-bold text-dark">Tableau de bord IoT</span>
        </div>

        <div className="d-flex align-items-center">
          <button className="btn btn-outline-primary me-2" onClick={handleHome}>
            <i className="bi bi-house-door me-1"></i> Accueil
          </button>
          <button className="btn btn-outline-primary me-3" onClick={handleRefresh}>
            <i className="bi bi-arrow-repeat me-1"></i> Rafraîchir
          </button>

          {user ? (
            <>
              <div className="d-flex align-items-center flex-nowrap">
            <span className="badge bg-success me-2">En ligne:</span>
               <div
                 className="d-flex align-items-center bg-light p-2 rounded me-3 text-nowrap text-truncate"
                 style={{ maxWidth: '340px' }} // Ajustez selon vos besoins
               >
                  <i className="bi bi-person-circle text-primary me-2"></i>
               <span>
                {user.mail} <span className="text-primary">({user.role})</span>
             </span>
                </div>
            </div>   
              <button 
                className="btn btn-outline-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i> Déconnexion
              </button>
            </>
          ) : (
            <span className="badge bg-warning text-dark">Non connecté</span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;