// src/pages/dht11/DeleteDht11Page.jsx

import React from 'react';
import axios from '../../utils/axios'; // Assurez-vous que ce chemin est correct
import * as bootstrap from 'bootstrap';

function DeleteDht11Modal({ id, data, onRefresh }) {
  const handleDelete = async () => {
    try {
      // Assurez-vous que le endpoint API est correct pour DHT11
      await axios.delete(`/api/dht11/${data.id}`);
      const modalElement = document.getElementById(id);
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
      onRefresh();
    } catch (err) {
      console.error('Erreur suppression DHT11:', err);
    }
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Confirmation de suppression DHT11</h5>
            <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>Voulez-vous vraiment supprimer cette donnée DHT11 ?</p>
            {data && (
              <ul>
                {/* Adaptez les champs d'affichage selon vos données DHT11 */}
                <li><strong>Température:</strong> {data.temperature} °C</li>
                <li><strong>Humidité:</strong> {data.humidity} %</li>
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

// C'est la ligne CRUCIALE qui manquait ou était incorrecte
export default DeleteDht11Modal;