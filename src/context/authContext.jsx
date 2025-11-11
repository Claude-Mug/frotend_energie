// src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../utils/axios'; // Assurez-vous que ce chemin est correct pour votre instance Axios

// Crée un contexte d'authentification
const AuthContext = createContext(null);

// Fournisseur d'authentification qui enveloppe l'application
export const AuthProvider = ({ children }) => {
  // État pour stocker les informations de l'utilisateur connecté (token, rôle, etc.)
  const [user, setUser] = useState(null);
  // État pour indiquer si le chargement initial des données d'authentification est terminé
  const [loading, setLoading] = useState(true);

  // Effet pour charger l'état d'authentification depuis le stockage local au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserData = localStorage.getItem('userData'); // Stocke l'objet user complet

    if (storedToken && storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        // Met à jour l'état user avec le token et les données utilisateur
        setUser({
          token: storedToken,
          ...userData // Contient id, nom, prenom, mail, role
        });
        // Configure Axios pour inclure le token dans toutes les requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (e) {
        console.error("Erreur lors de l'analyse des données utilisateur depuis le stockage local", e);
        // En cas d'erreur d'analyse, vide le stockage local pour éviter des problèmes futurs
        localStorage.clear();
      }
    }
    setLoading(false); // Indique que le chargement initial est terminé
  }, []); // S'exécute une seule fois au montage du composant

  // Fonction de connexion : stocke le token et les données utilisateur
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser({ token, ...userData });
    // Configure Axios pour inclure le token après la connexion
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // Fonction de déconnexion : vide le stockage local et l'état utilisateur
  const logout = () => {
    localStorage.clear();
    setUser(null);
    // Supprime le token des headers Axios
    delete axios.defaults.headers.common['Authorization'];
  };

  // Fournit l'état et les fonctions d'authentification aux composants enfants
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
