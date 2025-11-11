// src/components/LoginModal.jsx

import React, { useState, useEffect } from 'react';
import * as bootstrap from 'bootstrap'; // Importe Bootstrap JS
import axios from '../utils/axios'; // Importe l'instance Axios configurée
import { useAuth } from '../context/authContext'; // Importe le hook d'authentification

function LoginModal({ id = 'loginModal', showModal, onLoginSuccess }) {
  const { login } = useAuth(); // Accède à la fonction de connexion du contexte
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [modalInstance, setModalInstance] = useState(null);

  // Initialise le modal Bootstrap une fois le composant monté
  useEffect(() => {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const bsModal = new bootstrap.Modal(modalElement, {
        backdrop: 'static', // Empêche la fermeture en cliquant à l'extérieur
        keyboard: false     // Empêche la fermeture avec la touche Échap
      });
      setModalInstance(bsModal);
    }
  }, [id]);

  // Gère l'affichage du modal
  useEffect(() => {
    if (modalInstance) {
      if (showModal) {
        modalInstance.show();
      } else {
        modalInstance.hide();
      }
    }
  }, [showModal, modalInstance]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(null); // Réinitialise les erreurs

    try {
      const response = await axios.post('api/auth/login', { mail: email, mot_de_passe: password });
      const { token, user } = response.data; // Votre backend renvoie { message, token, user }

      login(token, user); // Stocke le token et les données utilisateur via le contexte
      onLoginSuccess(); // Appelle la fonction de succès passée en prop
      modalInstance.hide(); // Cache le modal après connexion réussie
      setEmail(''); // Réinitialise les champs
      setPassword('');
    } catch (err) {
      console.error('Erreur de connexion:', err);
      // Affiche le message d'erreur du backend ou un message générique
      setError(err.response?.data?.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
    }
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={`${id}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header p-5 pb-4 border-bottom-0">
            <h1 className="fw-bold mb-0 fs-2" id={`${id}Label`}>Connexion</h1>
            {/* Pas de bouton de fermeture si le backdrop est statique et le clavier désactivé */}
          </div>

          <div className="modal-body p-5 pt-0">
            {error && <div className="alert alert-danger mb-3">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control rounded-3"
                  id="emailInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="emailInput">Adresse email</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="passwordInput"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="passwordInput">Mot de passe</label>
              </div>
              <button className="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">
                Se connecter
              </button>
              <small className="text-body-secondary">
                En cliquant sur "Se connecter", vous acceptez les conditions d'utilisation.
              </small>
              {/* Optionnel: Bouton pour s'inscrire ou autre */}
              {/* <hr className="my-4" />
              <h2 className="fs-5 fw-bold mb-3">Ou utilisez</h2>
              <button className="w-100 py-2 mb-2 btn btn-outline-secondary rounded-3" type="button">
                <i className="bi bi-google me-2"></i> Se connecter avec Google
              </button> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
