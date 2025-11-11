// src/pages/ultrasonic/EtatUltrasonicPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown'; // Pour le sélecteur d'état (Activé/Désactivé)
import axios from '../../utils/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Toast } from 'primereact/toast';

function EtatUltrasonicModal({ visible, onHide, data, onRefresh }) {
  const toast = useRef(null);
  const queryClient = useQueryClient();

  // État local pour gérer le nouvel état sélectionné
  const [newStatus, setNewStatus] = useState(null);

  // Initialiser `newStatus` lorsque les données du capteur changent
  useEffect(() => {
    if (data) {
      setNewStatus(data.etat); // Assurez-vous que 'data.etat' est le champ correct pour l'état
    }
  }, [data]);

  const updateStatusMutation = useMutation({
    mutationFn: (updatedData) => axios.put(`/api/ultrasonic/${updatedData.id}`, updatedData),
    onSuccess: () => {
      toast.current.show({ severity: 'success', summary: 'Succès', detail: 'État du capteur ultrasonique mis à jour avec succès', life: 3000 });
      queryClient.invalidateQueries(['ultrasonicData']);
      onRefresh();
      onHide();
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de l'état du capteur:", error);
      toast.current.show({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Échec de la mise à jour de l\'état', life: 3000 });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data && newStatus !== null) {
      const updatedUltrasonic = {
        ...data, // Garder toutes les autres données du capteur
        etat: newStatus, // Mettre à jour le champ 'etat'
      };
      updateStatusMutation.mutate(updatedUltrasonic);
    }
  };

  const statusOptions = [
    { label: 'Activé', value: 1 },
    { label: 'Désactivé', value: 0 }
  ];

  const dialogFooter = (
    <div className="d-flex justify-content-end gap-2">
      <Button label="Annuler" icon="pi pi-times" className="p-button-secondary" onClick={onHide} />
      <Button label="Mettre à jour" icon="pi pi-check" type="submit" onClick={handleSubmit} />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={`Changer l'état du capteur: ${data?.id || ''}`}
        visible={visible}
        style={{ width: '30vw' }}
        breakpoints={{ '960px': '50vw', '641px': '90vw' }}
        modal
        className="p-fluid"
        footer={dialogFooter}
        onHide={onHide}
      >
        <form onSubmit={handleSubmit} className="p-grid p-formgrid p-fluid">
          <div className="p-col-12 p-mb-3">
            <label htmlFor="newStatus" className="form-label">Nouvel état</label>
            <Dropdown
              id="newStatus"
              name="newStatus"
              value={newStatus}
              options={statusOptions}
              onChange={(e) => setNewStatus(e.value)}
              placeholder="Sélectionner le nouvel état"
              required
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}

export default EtatUltrasonicModal;