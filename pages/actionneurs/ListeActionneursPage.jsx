// src/pages/actionneurs/ListeActionneursPage.jsx

import React, { useState } from 'react';
import axios from '../../utils/axios';
import * as bootstrap from 'bootstrap';

// NOUVEAU : Import React Query
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Import des modales
import AddActionneurModal from './AddActionneursPage';
import UpdateActionneurModal from './UpdateActionneursPage';
import DeleteActionneurModal from './DeleteActionneursPage';

// NOUVEAU : Fonction de fetch exportée pour React Query
export const fetchActionneursData = async () => {
  const res = await axios.get('/api/actionneurs');
  return res.data;
};

function ListeActionneursPage() {
  // NOUVEAU : Utilisation de useQuery
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['actionneursData'], // Clé unique pour cette requête
    queryFn: fetchActionneursData, // La fonction de fetch que vous avez exportée
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
    refetch(); // Demande à React Query de rafraîchir les données 'actionneursData'
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Données Actionneurs</h2>
        <button className="btn btn-primary" onClick={() => openModal('add')}>
          <i className="bi bi-plus-circle"></i> Ajouter
        </button>
      </div>

      {isLoading ? ( // NOUVEAU
        <div className="alert alert-info">Chargement...</div>
      ) : isError ? ( // NOUVEAU
        <div className="alert alert-danger">Erreur : {error.message}</div>
      ) : data.length === 0 ? (
        <div className="alert alert-warning">Aucune donnée disponible</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>id</th><th>Date/Heure</th><th>LED Rouge</th><th>LED Bleue</th><th>LED Blanche</th><th>LED Jaune</th><th>Moteur</th><th>Action</th><th>Zone</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.datetime}</td>
                  <td>{item.led_lr === 1 ? 'Activée' : 'Désactivée'}</td>
                  <td>{item.led_lb === 1 ? 'Activée' : 'Désactivée'}</td>
                  <td>{item.led_lw === 1 ? 'Activée' : 'Désactivée'}</td>
                  <td>{item.led_lj === 1 ? 'Activée' : 'Désactivée'}</td>
                  <td>{item.moteur === 1 ? 'Activé' : 'Désactivé'}</td>
                  <td>{item.action}</td>
                  <td>{item.zone}</td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modales Bootstrap - NOUVEAU : Utilisez handleModalRefresh */}
      <AddActionneurModal id="addModal" onRefresh={handleModalRefresh} />
      <UpdateActionneurModal id="editModal" data={selectedItem} onRefresh={handleModalRefresh} />
      <DeleteActionneurModal id="deleteModal" data={selectedItem} onRefresh={handleModalRefresh} />
    </div>
  );
}

export default ListeActionneursPage;