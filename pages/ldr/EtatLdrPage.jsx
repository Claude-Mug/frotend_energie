// src/pages/ldr/EtatLdrPage.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

function EtatLdrModal({ id, data, onRefresh }) {
  const [etat, setEtat] = useState(false);

  useEffect(() => {
    if (data) setEtat(Boolean(data.etat));
  }, [data]);

  const handleEtatChange = (e) => {
    setEtat(e.target.value === "true");
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/api/ldr/etat/${data.id}`, { etat });
      const modalElement = document.getElementById(id);
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
      onRefresh();
    } catch (err) {
      console.error('Erreur changement état:', err);
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
            <label htmlFor="etat-select" className="form-label">État :</label>
            <select
              id="etat-select"
              className="form-select"
              value={etat ? "true" : "false"}
              onChange={handleEtatChange}
            >
              <option value="true">Actif</option>
              <option value="false">Inactif</option>
            </select>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button className="btn btn-dark" onClick={handleSubmit}>Valider</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EtatLdrModal;