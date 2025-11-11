// src/pages/dht11/AddDht11Page.jsx

import React, { useState } from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

function AddDht11Modal({ id, onRefresh }) {
  const [form, setForm] = useState({
    temperature: '',
    humidite: '',
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
      await axios.post('/api/dht11', form);
      onRefresh();

      const modalElement = document.getElementById(id);
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();

      setForm({
        temperature: '',
        humidite: '',
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
            <h5 className="modal-title">Ajouter Donnée DHT11</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
          </div>
          <div className="modal-body">
            <input
              type="number"
              className="form-control mb-2"
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              placeholder="Température (°C)"
              required
            />
            <input
              type="number"
              className="form-control mb-2"
              name="humidite"
              value={form.humidite}
              onChange={handleChange}
              placeholder="Humidité (%)"
              required
            />
            <input
              type="text"
              className="form-control mb-2"
              name="action"
              value={form.action}
              onChange={handleChange}
              placeholder="Action"
              required
            />
            <input
              type="text"
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

export default AddDht11Modal;