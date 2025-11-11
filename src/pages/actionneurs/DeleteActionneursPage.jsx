// src/pages/actionneurs/DeleteActionneurPage.jsx

import React from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

function DeleteActionneurModal({ id, data, onRefresh }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/actionneurs/${data.id}`);
      const modalElement = document.getElementById(id);
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
      onRefresh();
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Confirmation de suppression</h5>
            <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>Voulez-vous vraiment supprimer cet actionneur ?</p>
            {data && (
              <ul>
                <li><strong>LED Rouge:</strong> {data.led_lr === 1 ? 'Activée' : 'Désactivée'}</li>
                <li><strong>LED Bleue:</strong> {data.led_lb === 1 ? 'Activée' : 'Désactivée'}</li>
                <li><strong>LED Blanche:</strong> {data.led_lw === 1 ? 'Activée' : 'Désactivée'}</li>
                <li><strong>LED Jaune:</strong> {data.led_lj === 1 ? 'Activée' : 'Désactivée'}</li>
                <li><strong>Moteur:</strong> {data.moteur === 1 ? 'Activé' : 'Désactivé'}</li>
                <li><strong>Action:</strong> {data.action}</li>
                <li><strong>Zone:</strong> {data.zone}</li>
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary text-info" data-bs-dismiss="modal">Annuler</button>
            <button className="btn btn-danger text-danger" onClick={handleDelete}>Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteActionneurModal;