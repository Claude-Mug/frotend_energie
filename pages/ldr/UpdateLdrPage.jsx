// src/pages/ldr/UpdateLdrPage.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

function UpdateLdrModal({ id, data, onRefresh }) {
  const [form, setForm] = useState({
    luminosite_niveau: '',
    action: '',
    zone: '',
    etat: 0
  });

  useEffect(() => {
    if (data) {
      setForm({
        luminosite_niveau: data.luminosite_niveau,
        action: data.action,
        zone: data.zone,
        etat: data.etat
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/ldr/${data.id}`, form);
      const modalElement = document.getElementById(id);
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
      onRefresh();
    } catch (err) {
      console.error('Erreur mise à jour:', err);
    }
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modifier Donnée LDR</h5>
            <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <input
              type="number"
              name="luminosite_niveau"
              className="form-control mb-2"
              placeholder="Niveau de luminosité"
              value={form.luminosite_niveau}
              onChange={handleChange}
            />
            <input
              type="text"
              name="action"
              className="form-control mb-2"
              placeholder="Action"
              value={form.action}
              onChange={handleChange}
            />
            <input
              type="text"
              name="zone"
              className="form-control mb-2"
              placeholder="Zone"
              value={form.zone}
              onChange={handleChange}
            />
            <select
              name="etat"
              className="form-select"
              value={form.etat}
              onChange={handleChange}
            >
              <option value={0}>Inactif</option>
              <option value={1}>Actif</option>
            </select>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button className="btn btn-success" onClick={handleUpdate}>Mettre à jour</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateLdrModal;