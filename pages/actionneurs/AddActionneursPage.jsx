// src/pages/actionneurs/AddActionneurPage.jsx

import React, { useState } from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

function AddActionneurModal({ id, onRefresh }) {
  const [form, setForm] = useState({
    led_lr: 0,
    led_lb: 0,
    led_lw: 0,
    led_lj: 0,
    moteur: 0,
    action: '',
    zone: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/actionneurs', form);
      onRefresh();

      const modalElement = document.getElementById(id);
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();

      setForm({
        led_lr: 0,
        led_lb: 0,
        led_lw: 0,
        led_lj: 0,
        moteur: 0,
        action: '',
        zone: ''
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
            <h5 className="modal-title">Ajouter un Actionneur</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
          </div>
          <div className="modal-body">
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="led_lr_switch"
                name="led_lr"
                checked={form.led_lr === 1}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="led_lr_switch">LED Rouge</label>
            </div>
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="led_lb_switch"
                name="led_lb"
                checked={form.led_lb === 1}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="led_lb_switch">LED Bleue</label>
            </div>
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="led_lw_switch"
                name="led_lw"
                checked={form.led_lw === 1}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="led_lw_switch">LED Blanche</label>
            </div>
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="led_lj_switch"
                name="led_lj"
                checked={form.led_lj === 1}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="led_lj_switch">LED Jaune</label>
            </div>
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="moteur_switch"
                name="moteur"
                checked={form.moteur === 1}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="moteur_switch">Moteur</label>
            </div>
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

export default AddActionneurModal;