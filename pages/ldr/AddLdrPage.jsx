// src/pages/ldr/AddLdrPage.jsx

import React, { useState } from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

function AddLdrModal({ id, onRefresh }) {
  const [form, setForm] = useState({
    luminosite_niveau: '',
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
      await axios.post('/api/ldr', form);
      onRefresh();

      const modalElement = document.getElementById(id);
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();

      setForm({
        luminosite_niveau: '',
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
            <h5 className="modal-title">Ajouter Donnée LDR</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
          </div>
          <div className="modal-body">
            <input
              type="number"
              className="form-control mb-2"
              name="luminosite_niveau"
              value={form.luminosite_niveau}
              onChange={handleChange}
              placeholder="Niveau de luminosité"
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

export default AddLdrModal;