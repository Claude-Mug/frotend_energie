// src/pages/pir/DeletePirPage.jsx

import React from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

function DeletePirModal({ id, data, onRefresh }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/pir/${data.id}`);
      onRefresh();
      bootstrap.Modal.getInstance(document.getElementById(id)).hide();
    } catch (err) {
      console.error('Erreur suppression PIR :', err);
    }
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmer la suppression</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <p>Voulez-vous vraiment supprimer cette donnée PIR ?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
            <button className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeletePirModal;
