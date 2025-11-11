// src/pages/pir/UpdatePirPage.jsx

import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

function UpdatePirModal({ id, data, onRefresh }) {
  const [form, setForm] = useState({
    etat_mouvement: '',
    action: '',
    zone: '',
    etat: 0,
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/pir/${data.id}`, form);
      onRefresh();
      bootstrap.Modal.getInstance(document.getElementById(id)).hide();
    } catch (err) {
      console.error('Erreur lors de la mise à jour PIR :', err);
    }
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">Modifier PIR</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <input className="form-control mb-2" name="etat_mouvement" value={form.etat_mouvement} onChange={handleChange} />
            <input className="form-control mb-2" name="action" value={form.action} onChange={handleChange} />
            <input className="form-control mb-2" name="zone" value={form.zone} onChange={handleChange} />
            <select className="form-control" name="etat" value={form.etat} onChange={handleChange}>
              <option value={0}>Inactif</option>
              <option value={1}>Actif</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-warning">Modifier</button>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePirModal;
