// src/pages/ultrasonic/ListeUltrasonicPage.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as bootstrap from 'bootstrap'; 

// Import des modales
import AddUltrasonicModal from './AddUltrasonicPage';
import UpdateUltrasonicModal from './UpdateUltrasonicPage';
import DeleteUltrasonicModal from './DeleteUltrasonicPage';
import EtatUltrasonicModal from './EtatUltrasonicPage';

// Fonction de fetch séparée pour useQuery
export const fetchUltrasonicData = async () => {
  const res = await axios.get('/api/ultrasonic');
  return res.data;
};

function ListeUltrasonicPage() {
  // useQuery gère le chargement, le caching, l'erreur, etc.
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['ultrasonicData'], // Clé unique pour cette requête
    queryFn: fetchUltrasonicData, // La fonction qui va chercher les données
    staleTime: 5 * 60 * 1000, // Les données sont "stale" après 5 minutes (pour le re-fetch en arrière-plan)
    // initialData: [] // Vous pourriez définir des données initiales si vous voulez éviter un flash vide
  });

  const queryClient = useQueryClient(); // Pour l'invalidation et le prefetching

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const openModal = (type, item = null) => {
    setSelectedItem(item);
    setModalType(type);
    const modal = new bootstrap.Modal(document.getElementById(`${type}Modal`));
    modal.show();
  };

  // Lors d'une modification/suppression, invalidez le cache pour re-fetch
  const handleModalRefresh = () => {
    refetch(); // Ou queryClient.invalidateQueries(['ultrasonicData']);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Données Ultrasonic</h2>
        <button className="btn btn-primary" onClick={() => openModal('add')}>
          <i className="bi bi-plus-circle"></i> Ajouter
        </button>
      </div>

      {isLoading ? (
        <div className="alert alert-info">Chargement...</div>
      ) : isError ? (
        <div className="alert alert-danger">Erreur : {error.message}</div>
      ) : data.length === 0 ? (
        <div className="alert alert-warning">Aucune donnée Ultrasonic disponible</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>id</th><th>Date/Heure</th><th>Distance (cm)</th><th>Action</th><th>Zone</th><th>État</th><th>Action Crud</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.datetime}</td>
                  <td>{item.distance_cm}</td>
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

      <AddUltrasonicModal id="addModal" onRefresh={handleModalRefresh} />
      <UpdateUltrasonicModal id="editModal" data={selectedItem} onRefresh={handleModalRefresh} />
      <DeleteUltrasonicModal id="deleteModal" data={selectedItem} onRefresh={handleModalRefresh} />
      <EtatUltrasonicModal id="etatModal" data={selectedItem} onRefresh={handleModalRefresh} />
    </div>
  );
}

export default ListeUltrasonicPage;