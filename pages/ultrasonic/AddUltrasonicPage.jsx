// src/pages/ultrasonic/AddUltrasonicPage.jsx

import React, { useState } from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap'; 

function AddUltrasonicModal({ id, onRefresh }) {
  const [form, setForm] = useState({
    distance_cm: '',
    action: '',
    zone: '',
    etat: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/ultrasonic', form);
      onRefresh(); // Recharge la liste

      // Fermeture de la modale Bootstrap
      const modalElement = document.getElementById(id);
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();

      // Optionnel : reset du formulaire après fermeture
      setForm({
        distance_cm: '',
        action: '',
        zone: '',
        etat: 0
      });
    } catch (err) {
      console.error('Erreur lors de l\'ajout :', err);
    }
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">Ajouter Ultrasonic</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
          </div>
          <div className="modal-body">
            <input
              className="form-control mb-2"
              name="distance_cm"
              value={form.distance_cm}
              onChange={handleChange}
              placeholder="Distance (cm)"
              required
            />
            <input
              className="form-control mb-2"
              name="action"
              value={form.action}
              onChange={handleChange}
              placeholder="Action"
              required
            />
            <input
              className="form-control mb-2"
              name="zone"
              value={form.zone}
              onChange={handleChange}
              placeholder="Zone"
              required
            />
            <select
              className="form-control"
              name="etat"
              value={form.etat}
              onChange={handleChange}
              required
            >
              <option value={0}>Inactif</option>
              <option value={1}>Actif</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">Ajouter</button>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUltrasonicModal;
