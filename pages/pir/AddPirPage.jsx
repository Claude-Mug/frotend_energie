// src/pages/pir/AddPirPage.jsx

import React, { useState } from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

function AddPirModal({ id, onRefresh }) {
  const [form, setForm] = useState({
    etat_mouvement: '',
    action: '',
    zone: '',
    etat: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/pir', form);
      onRefresh();
      bootstrap.Modal.getInstance(document.getElementById(id)).hide();
    } catch (err) {
      console.error('Erreur lors de l\'ajout PIR :', err);
    }
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">Ajouter PIR</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <input className="form-control mb-2" name="etat_mouvement" placeholder="État mouvement" onChange={handleChange} required />
            <input className="form-control mb-2" name="action" placeholder="Action" onChange={handleChange} required />
            <input className="form-control mb-2" name="zone" placeholder="Zone" onChange={handleChange} required />
            <select className="form-control" name="etat" onChange={handleChange}>
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

export default AddPirModal;
