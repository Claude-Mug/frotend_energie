// src/pages/actionneurs/UpdateActionneurPage.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

function UpdateActionneurModal({ id, data, onRefresh }) {
  const [form, setForm] = useState({
    led_lr: 0,
    led_lb: 0,
    led_lw: 0,
    led_lj: 0,
    moteur: 0,
    action: '',
    zone: ''
  });

  useEffect(() => {
    if (data) {
      setForm({
        led_lr: data.led_lr,
        led_lb: data.led_lb,
        led_lw: data.led_lw,
        led_lj: data.led_lj,
        moteur: data.moteur,
        action: data.action,
        zone: data.zone
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/actionneurs/${data.id}`, form);
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
            <h5 className="modal-title">Modifier Actionneur</h5>
            <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="update_led_lr_switch"
                name="led_lr"
                checked={form.led_lr === 1}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="update_led_lr_switch">LED Rouge</label>
            </div>
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="update_led_lb_switch"
                name="led_lb"
                checked={form.led_lb === 1}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="update_led_lb_switch">LED Bleue</label>
            </div>
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="update_led_lw_switch"
                name="led_lw"
                checked={form.led_lw === 1}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="update_led_lw_switch">LED Blanche</label>
            </div>
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="update_led_lj_switch"
                name="led_lj"
                checked={form.led_lj === 1}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="update_led_lj_switch">LED Jaune</label>
            </div>
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="update_moteur_switch"
                name="moteur"
                checked={form.moteur === 1}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="update_moteur_switch">Moteur</label>
            </div>
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

export default UpdateActionneurModal;