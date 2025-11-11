// src/pages/pir/EtatPirPage.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

function EtatPirModal({ id, data, onRefresh }) {
  const [etat, setEtat] = useState(0);

  useEffect(() => {
    if (data) setEtat(data.etat);
  }, [data]);

  const handleEtatChange = async () => {
    try {
      await axios.put(`/api/pir/etat/${data.id}`, { etat: etat === 1 ? 0 : 1 });
      onRefresh();
      bootstrap.Modal.getInstance(document.getElementById(id)).hide();
    } catch (err) {
      console.error('Erreur changement état PIR :', err);
    }
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Changer l'état</h5>
            <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>État actuel: <strong>{etat === 1 ? 'Actif' : 'Inactif'}</strong></p>
            <p>Voulez-vous changer l'état ?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button className="btn btn-dark" onClick={handleEtatChange}>Changer l'état</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EtatPirModal;
