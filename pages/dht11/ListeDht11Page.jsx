// src/pages/dht11/ListeDht11Page.jsx

import React, { useState } from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

// NOUVEAU : Import React Query
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Import des modales (assurez-vous qu'elles sont correctement définies et exportées)
import AddDht11Modal from './AddDht11Page';
import UpdateDht11Modal from './UpdateDht11Page';
import DeleteDht11Modal from './DeleteDht11Page';
import EtatDht11Modal from './EtatDht11Page'; // Si vous avez une modale pour l'état

// NOUVEAU : Fonction de fetch exportée pour React Query
export const fetchDht11Data = async () => {
  const res = await axios.get('/api/dht11');
  return res.data;
};

function ListeDht11Page() {
  // NOUVEAU : Utilisation de useQuery
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dht11Data'], // Clé unique pour cette requête
    queryFn: fetchDht11Data, // La fonction de fetch que vous avez exportée
    staleTime: 5 * 60 * 1000, // Les données sont "stale" après 5 minutes
  });

  const queryClient = useQueryClient(); // Pour la gestion du cache et du re-fetch

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const openModal = (type, item = null) => {
    setSelectedItem(item);
    setModalType(type);
    const modal = new bootstrap.Modal(document.getElementById(`${type}Modal`));
    modal.show();
  };

  // NOUVEAU : Fonction de rafraîchissement des données après une action CUD
  const handleModalRefresh = () => {
    refetch(); // Demande à React Query de rafraîchir les données 'dht11Data'
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Données DHT11</h2>
        <button className="btn btn-primary" onClick={() => openModal('add')}>
          <i className="bi bi-plus-circle"></i> Ajouter
        </button>
      </div>

      {isLoading ? ( // NOUVEAU
        <div className="alert alert-info">Chargement...</div>
      ) : isError ? ( // NOUVEAU
        <div className="alert alert-danger">Erreur : {error.message}</div>
      ) : data.length === 0 ? (
        <div className="alert alert-warning">Aucune donnée DHT11 disponible</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>id</th><th>Date/Heure</th><th>Température (°C)</th><th>Humidité (%)</th><th>Action</th><th>Zone</th><th>État</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.datetime}</td>
                  <td>{item.temperature}</td>
                  <td>{item.humidity}</td>
                  <td>{item.action}</td>
                  <td>{item.zone}</td>
                  <td>{item.etat == 1 || item.etat === true ? 'Actif' : 'Inactif'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-warning me-1"
                      onClick={() => openModal('edit', item)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger me-1"
                      onClick={() => openModal('delete', item)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                    {/* Si vous avez une modale EtatDht11Modal */}
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => openModal('etat', item)}
                    >
                      <i className="bi bi-sliders"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modales Bootstrap - NOUVEAU : Utilisez handleModalRefresh */}
      <AddDht11Modal id="addModal" onRefresh={handleModalRefresh} />
      <UpdateDht11Modal id="editModal" data={selectedItem} onRefresh={handleModalRefresh} />
      <DeleteDht11Modal id="deleteModal" data={selectedItem} onRefresh={handleModalRefresh} />
      {/* Si vous avez une modale EtatDht11Modal */}
      <EtatDht11Modal id="etatModal" data={selectedItem} onRefresh={handleModalRefresh} />
    </div>
  );
}

export default ListeDht11Page;