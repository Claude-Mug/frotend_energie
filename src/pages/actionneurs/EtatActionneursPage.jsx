// src/pages/actionneurs/EtatActionneurPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown'; // Pour le sélecteur d'état
import axios from '../../utils/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Toast } from 'primereact/toast';

function EtatActionneurModal({ visible, onHide, data, onRefresh }) {
  const toast = useRef(null);
  const queryClient = useQueryClient();

  // État local pour gérer le nouvel état sélectionné
  const [newStatus, setNewStatus] = useState(null);

  useEffect(() => {
    if (data) {
      setNewStatus(data.led_lr); // Supposons que nous changeons l'état de led_lr pour cet exemple
      // Si vous avez un champ 'etat' global, utilisez: setNewStatus(data.etat);
    }
  }, [data]);

  const updateStatusMutation = useMutation({
    mutationFn: (updatedData) => axios.put(`/api/actionneurs/${updatedData.id}`, updatedData),
    onSuccess: () => {
      toast.current.show({ severity: 'success', summary: 'Succès', detail: 'État de l\'actionneur mis à jour avec succès', life: 3000 });
      queryClient.invalidateQueries(['actionneursData']);
      onRefresh();
      onHide(); // Fermer la modale après succès
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de l'état de l'actionneur:", error);
      toast.current.show({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Échec de la mise à jour de l\'état', life: 3000 });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data && newStatus !== null) {
      
      const updatedActionneur = {
        ...data, // Garder toutes les autres données de l'actionneur
        led_lr: newStatus, // Mettre à jour le champ d'état choisi
        // Ou si vous avez un champ 'etat' global: etat: newStatus,
      };
      updateStatusMutation.mutate(updatedActionneur);
    }
  };

  const statusOptions = [
    { label: 'Activé', value: 1 },
    { label: 'Désactivé', value: 0 }
  ];

  const dialogFooter = (
    <div className="d-flex justify-content-end gap-2">
      <Button label="Annuler" icon="pi pi-times" className="p-button-secondary text-info" onClick={onHide} />
      <Button label="Mettre à jour" icon="pi pi-check" type="submit" className='text-secondary' onClick={handleSubmit} />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={`Changer l'état de l'actionneur: ${data?.id || ''}`}
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

export default EtatActionneurModal;