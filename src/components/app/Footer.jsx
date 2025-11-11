// src/components/app/Footer.jsx

import React from 'react';
import { useAuth } from '../../context/authContext';

function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  // Le footer ne s'affiche que si l'utilisateur est connecté
  if (!user) {
    return null;
  }

  return (
    <footer 
      className="bg-white text-black text-center py-3"
      style={{
        position: 'fixed',
        bottom: 0,
        left: '280px', // Correspond à la largeur de la SideBar
        width: 'calc(100% - 280px)',
        zIndex: 1000,
        borderTop: '0.5px solid #495057'
      }}
    >
      <div className="container-fluid">
        <p className="mb-0">
          © {currentYear} Electrro-Lab IoT. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

export default Footer;