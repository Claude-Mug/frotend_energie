// src/utils/axios.js

import axios from 'axios';

// Crée une instance Axios avec une URL de base
const instance = axios.create({
  baseURL: 'https://gestion-energie.onrender.com', // Adaptez à l'URL de base de votre API backend
  timeout: 5000, // Timeout de 5 secondes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes : ajoute le token JWT à chaque requête sortante
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Récupère le token du stockage local
    if (token) {
      // Si un token existe, l'ajoute à l'en-tête Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Retourne la configuration de la requête modifiée
  },
  (error) => {
    // Gère les erreurs de requête
    return Promise.reject(error);
  }
);

// Intercepteur de réponses : gère les erreurs globales comme les 401 (Non autorisé)
instance.interceptors.response.use(
  (response) => response, // Si la réponse est OK, la passe directement
  (error) => {
    // Si l'erreur est un 401 (Unauthorized) et que ce n'est pas une requête de login/register
    // cela signifie que le token est invalide ou expiré.
    if (error.response && error.response.status === 401 && !error.config.url.includes('/auth/')) {
      console.log("Token invalide ou expiré. Déconnexion de l'utilisateur.");
      // Optionnel : Rediriger l'utilisateur vers la page de connexion
      // window.location.href = '/login'; // Ou utilisez votre système de routage
      // Supprimer le token et les données utilisateur du localStorage
      localStorage.clear();
      // Rejeter la promesse pour que le composant appelant puisse gérer l'erreur
      return Promise.reject(error);
    }
    return Promise.reject(error); // Pour toutes les autres erreurs, rejeter la promesse
  }
);

export default instance; // Exporte l'instance Axios configurée
