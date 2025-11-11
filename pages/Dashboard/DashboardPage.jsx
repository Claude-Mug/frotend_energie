// src/pages/Dashboard/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios'; // Assurez-vous que ce chemin est correct
import { useAuth } from '../../context/authContext'; // Importez useAuth

// Composant générique pour contrôler un module (Capteurs)
function ModuleControl({ moduleName, apiEndpoint, defaultStatus = false }) {
  const { user } = useAuth(); // Accède aux informations de l'utilisateur
  const userRole = user?.role;

  const [mainActive, setMainActive] = useState(defaultStatus);
  const [modeAutoActive, setModeAutoActive] = useState(false); // Exemple de commande 1
  const [alerteSonoreActive, setAlerteSonoreActive] = useState(false); // Exemple de commande 2
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Détermine si l'utilisateur a les droits d'écriture/modification (Admin ou Technicien)
  const canWriteModify = ['Admin', 'Technicien'].includes(userRole);

  // --- Récupération de l'état initial du module ---
  useEffect(() => {
    // Exécuter cette logique UNIQUEMENT si l'utilisateur est connecté
    if (!user) {
      // Si l'utilisateur n'est pas connecté, réinitialiser l'état et ne pas faire d'appel API
      setMainActive(defaultStatus);
      return;
    }

    const fetchInitialState = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiEndpoint}/etat`); // Appel à la route GET /etat
        // Gère les booléens (true/false) ou les 0/1
        const etat = response.data.etat === true || response.data.etat === 1;
        setMainActive(etat);
      } catch (err) {
        console.error(`Erreur lors de la récupération de l'état initial pour ${moduleName}:`, err);
        if (err.response) {
          if (err.response.status === 404) {
            // Si 404 (pas de données), on initialise à false et on ne met pas d'erreur persistante
            setMainActive(false);
          } else if (err.response.status === 401) {
            // L'erreur 401 est gérée par l'intercepteur Axios, mais on peut la log ici
            setError("Session expirée ou non autorisé. Veuillez vous reconnecter.");
          } else if (err.response.status === 403) {
            setError("Vous n'êtes pas autorisé à voir l'état de ce module.");
          } else {
            setError(`Échec du chargement de l'état pour ${moduleName}.`);
          }
        } else {
          setError(`Échec du chargement de l'état pour ${moduleName}.`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialState();
  }, [apiEndpoint, moduleName, user]); // Déclenche l'effet lorsque user change (connexion/déconnexion)

  // Fonction générique pour basculer l'état d'une commande
  const toggleControl = async (controlName, currentStatus, setControlState) => {
    if (!canWriteModify) {
      setError("Vous n'êtes pas autorisé à effectuer cette action.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newStatus = !currentStatus;

      if (controlName === 'Main') {
        // Appel API pour le switch principal (changeLastEtat)
        await axios.put(`${apiEndpoint}/etat`, { etat: newStatus ? 1 : 0 }); // Envoyer 0 ou 1
        console.log(`API CALL: Basculement de "${moduleName} - Principal" vers ${newStatus ? 'Actif' : 'Inactif'}`);
      } else {
        // Ces commandes secondaires nécessitent des endpoints spécifiques sur votre backend.
        // Pour l'instant, elles ne mettront à jour que l'état local.
        console.warn(`NOTE: La commande "${controlName}" pour "${moduleName}" n'a pas d'endpoint API implémenté côté backend. Mise à jour locale seulement.`);
      }

      setControlState(newStatus); // Met à jour l'état local après l'appel API (ou pour l'exemple)

    } catch (err) {
      console.error(`Erreur lors du basculement de ${moduleName} - ${controlName}:`, err);
      if (err.response) {
        if (err.response.status === 403) {
          setError("Accès refusé. Vous n'avez pas la permission d'effectuer cette action.");
        } else if (err.response.status === 401) {
          setError("Session expirée. Veuillez vous reconnecter.");
        } else {
          setError(`Échec du basculement de ${controlName}. Vérifiez la console pour les détails.`);
        }
      } else {
        setError(`Échec du basculement de ${controlName}. Vérifiez la console pour les détails.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 shadow-lg border-0 rounded-3 overflow-hidden">
      <div className="card-header bg-primary text-white text-center py-3">
        <h5 className="mb-0 fs-4">{moduleName}</h5>
      </div>
      <div className="card-body p-4">
        {error && <div className="alert alert-danger mt-2">{error}</div>}

        {/* Interrupteur principal : Activer/Désactiver le module */}
        <div className="form-check form-switch d-flex align-items-center justify-content-between my-3 py-2 border-bottom">
          <label className="form-check-label fs-6 fw-bold" htmlFor={`switch-${moduleName}-main`}>
            Module Principal :
          </label>
          <input
            className="form-check-input flex-shrink-0"
            type="checkbox"
            role="switch"
            id={`switch-${moduleName}-main`}
            checked={mainActive}
            onChange={() => toggleControl('Main', mainActive, setMainActive)}
            disabled={loading || !canWriteModify} // Désactive si chargement ou non autorisé
            style={{ transform: 'scale(1.5)' }}
          />
          <span className={`ms-3 fw-bold ${mainActive ? 'text-success' : 'text-danger'}`}>
            {mainActive ? 'Actif' : 'Inactif'}
          </span>
        </div>

        {/* Commande 1 : Mode Automatique */}
        <div className="form-check form-switch d-flex align-items-center justify-content-between my-3 py-2 border-bottom">
          <label className="form-check-label fs-6" htmlFor={`switch-${moduleName}-modeauto`}>
            Mode Automatique :
          </label>
          <input
            className="form-check-input flex-shrink-0"
            type="checkbox"
            role="switch"
            id={`switch-${moduleName}-modeauto`}
            checked={modeAutoActive}
            onChange={() => toggleControl('ModeAuto', modeAutoActive, setModeAutoActive)}
            disabled={loading || !canWriteModify} // Désactive si chargement ou non autorisé
            style={{ transform: 'scale(1.2)' }}
          />
          <span className={`ms-3 fw-bold ${modeAutoActive ? 'text-success' : 'text-danger'}`}>
            {modeAutoActive ? 'Activé' : 'Désactivé'}
          </span>
        </div>

        {/* Commande 2 : Alerte Sonore */}
        <div className="form-check form-switch d-flex align-items-center justify-content-between my-3 py-2">
          <label className="form-check-label fs-6" htmlFor={`switch-${moduleName}-alerte`}>
            Alerte Sonore :
          </label>
          <input
            className="form-check-input flex-shrink-0"
            type="checkbox"
            role="switch"
            id={`switch-${moduleName}-alerte`}
            checked={alerteSonoreActive}
            onChange={() => toggleControl('AlerteSonore', alerteSonoreActive, setAlerteSonoreActive)}
            disabled={loading || !canWriteModify} // Désactive si chargement ou non autorisé
            style={{ transform: 'scale(1.2)' }}
          />
          <span className={`ms-3 fw-bold ${alerteSonoreActive ? 'text-success' : 'text-danger'}`}>
            {alerteSonoreActive ? 'Activée' : 'Désactivée'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Composant spécifique pour les Actionneurs avec 6 interrupteurs
function ActionneursControl() {
  const { user } = useAuth();
  const userRole = user?.role;
  const canWriteModify = ['Admin', 'Technicien'].includes(userRole);

  const [ledLR, setLedLR] = useState(false); // LED Rouge
  const [ledLB, setLedLB] = useState(false); // LED Bleue
  const [ledLW, setLedLW] = useState(false); // LED Blanche
  const [ledLJ, setLedLJ] = useState(false); // LED Jaune
  const [moteur, setMoteur] = useState(false);
  const [buzzer, setBuzzer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // MAPPING des types d'actionneurs à leurs états et setters
  const actionneurStates = {
    led_lr: { state: ledLR, setter: setLedLR, label: "LED Rouge" },
    led_lb: { state: ledLB, setter: setLedLB, label: "LED Bleue" },
    led_lw: { state: ledLW, setter: setLedLW, label: "LED Blanche" },
    led_lj: { state: ledLJ, setter: setLedLJ, label: "LED Jaune" },
    moteur: { state: moteur, setter: setMoteur, label: "Moteur" },
    buzzer: { state: buzzer, setter: setBuzzer, label: "Buzzer" },
  };

  // --- NOUVEAU : Récupération de l'état initial pour CHAQUE actionneur ---
  useEffect(() => {
    // Exécuter cette logique UNIQUEMENT si l'utilisateur est connecté
    if (!user) {
      // Si l'utilisateur n'est pas connecté, réinitialiser tous les états à false
      Object.values(actionneurStates).forEach(item => item.setter(false));
      return;
    }

    const fetchAllActionneurStates = async () => {
      setLoading(true);
      setError(null);
      const newStates = {};
      for (const type of Object.keys(actionneurStates)) {
        try {
          // Appel GET pour chaque type d'actionneur
          // Ceci suppose que votre backend a une route GET /api/actionneurs/etat?type={type}
          const res = await axios.get(`/api/actionneurs/etat?type=${type}`);
          newStates[type] = res.data.etat === true || res.data.etat === 1;
        } catch (err) {
          console.warn(`Impossible de récupérer l'état de ${actionneurStates[type].label} (${type}):`, err.message);
          // Gérer les erreurs de récupération pour chaque actionneur individuellement
          if (err.response) {
            if (err.response.status === 401) {
              setError("Session expirée. Veuillez vous reconnecter.");
            } else if (err.response.status === 403) {
              setError("Vous n'êtes pas autorisé à voir l'état des actionneurs.");
            } else if (err.response.status === 404) {
              // C'est normal si l'actionneur n'a pas encore de données, on le met à false
              newStates[type] = false;
            } else {
              setError(`Échec du chargement de l'état pour ${actionneurStates[type].label}.`);
            }
          } else {
            setError(`Échec du chargement de l'état pour ${actionneurStates[type].label}.`);
          }
          newStates[type] = false; // Défaut à false en cas d'erreur ou 404
        }
      }

      // Mettre à jour les états locaux une fois tous les appels terminés
      setLedLR(newStates.led_lr);
      setLedLB(newStates.led_lb);
      setLedLW(newStates.led_lw);
      setLedLJ(newStates.led_lj);
      setMoteur(newStates.moteur);
      setBuzzer(newStates.buzzer);

      setLoading(false);
    };

    fetchAllActionneurStates();
  }, [user]); // Déclenche l'effet lorsque user change

  // Fonction pour basculer l'état d'un actionneur
  const toggleActionneur = async (actionneurType, currentStatus, setStatus) => {
    if (!canWriteModify) {
      setError("Vous n'êtes pas autorisé à effectuer cette action.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newStatus = !currentStatus;
      // Appel PUT à votre backend pour changer l'état d'un actionneur spécifique par son type
      // Ceci suppose que votre backend a une route PUT /api/actionneurs/etat qui accepte { type, etat }
      await axios.put(`/api/actionneurs/etat`, { type: actionneurType, etat: newStatus ? 1 : 0 }); // Envoyer 0 ou 1
      console.log(`API CALL: Basculement de "${actionneurType}" vers ${newStatus ? 'Actif' : 'Inactif'}`);
      setStatus(newStatus); // Met à jour l'état local après l'appel API
    } catch (err) {
      console.error(`Erreur lors du basculement de ${actionneurType}:`, err);
      if (err.response) {
        if (err.response.status === 403) {
          setError("Accès refusé. Vous n'avez pas la permission d'effectuer cette action.");
        } else if (err.response.status === 401) {
          setError("Session expirée. Veuillez vous reconnecter.");
        } else {
          setError(`Échec du basculement de ${actionneurType}. Vérifiez la console.`);
        }
      } else {
        setError(`Échec du basculement de ${actionneurType}. Vérifiez la console.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const ActionneurSwitch = ({ label, type, status, setStatus }) => (
    <div className="form-check form-switch d-flex align-items-center justify-content-between my-3 py-2 border-bottom">
      <label className="form-check-label fs-6" htmlFor={`switch-${type}`}>
        {label} :
      </label>
      <input
        className="form-check-input flex-shrink-0"
        type="checkbox"
        role="switch"
        id={`switch-${type}`}
        checked={status}
        onChange={() => toggleActionneur(type, status, setStatus)}
        disabled={loading || !canWriteModify} // Désactive si chargement ou non autorisé
        style={{ transform: 'scale(1.2)' }}
      />
      <span className={`ms-3 fw-bold ${status ? 'text-success' : 'text-danger'}`}>
        {status ? 'Activé' : 'Désactivé'}
      </span>
    </div>
  );

  return (
    <div className="card mb-4 shadow-lg border-0 rounded-3 overflow-hidden">
      <div className="card-header bg-success text-white text-center py-3">
        <h5 className="mb-0 fs-4">Actionneurs</h5>
      </div>
      <div className="card-body p-4">
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        {loading && <div className="text-center text-primary">Chargement des états des actionneurs...</div>}

        <ActionneurSwitch label="LED Rouge" type="led_lr" status={ledLR} setStatus={setLedLR} />
        <ActionneurSwitch label="LED Bleue" type="led_lb" status={ledLB} setStatus={setLedLB} />
        <ActionneurSwitch label="LED Blanche" type="led_lw" status={ledLW} setStatus={setLedLW} />
        <ActionneurSwitch label="LED Jaune" type="led_lj" status={ledLJ} setStatus={setLedLJ} />
        <ActionneurSwitch label="Moteur" type="moteur" status={moteur} setStatus={setMoteur} />
        <ActionneurSwitch label="Buzzer" type="buzzer" status={buzzer} setStatus={setBuzzer} />
      </div>
    </div>
  );
}

// Le composant principal de la page de commandes
function DashboardPage() {
  return (
    <div className="dashboard-page p-4 bg-light min-vh-100">
      <h2 className="mb-5 text-center text-secondary display-5 fw-bold">
        <i className="bi bi-ui-checks me-3"></i> Panneau de Contrôle IoT
      </h2>

      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-8 col-lg-6 mb-4">
          <ModuleControl moduleName="Capteur Ultrason" apiEndpoint="/api/ultrasonic" />
        </div>
        <div className="col-sm-10 col-md-8 col-lg-6 mb-4">
          <ModuleControl moduleName="Capteur PIR" apiEndpoint="/api/pir" />
        </div>
        <div className="col-sm-10 col-md-8 col-lg-6 mb-4">
          <ModuleControl moduleName="Capteur DHT11" apiEndpoint="/api/dht11" />
        </div>
        <div className="col-sm-10 col-md-8 col-lg-6 mb-4">
          <ModuleControl moduleName="Capteur LDR" apiEndpoint="/api/ldr" />
        </div>
        <div className="col-sm-10 col-md-8 col-lg-6 mb-4">
          <ActionneursControl />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
