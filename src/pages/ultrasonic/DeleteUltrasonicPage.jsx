// src/pages/ultrasonic/DeleteUltrasonicPage.jsx

import React from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

function DeleteUltrasonicModal({ id, data, onRefresh }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/ultrasonic/${data.id}`);
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
            <p>Voulez-vous vraiment supprimer cette donnée ?</p>
            {data && (
              <ul>
                <li><strong>Distance:</strong> {data.distance_cm} cm</li>
                <li><strong>Action:</strong> {data.action}</li>
                <li><strong>Zone:</strong> {data.zone}</li>
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteUltrasonicModal;
