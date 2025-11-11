// src/pages/dht11/EtatDht11Page.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Importez useMutation et useQueryClient

function EtatDht11Modal({ visible, onHide, data, onRefresh, toast }) { // Ajoutez toast en prop
  const queryClient = useQueryClient();
  const [etatValue, setEtatValue] = useState(null);

  useEffect(() => {
    if (visible && data) {
      setEtatValue(data.etat === 1 || data.etat === true || data.etat === '1' ? 1 : 0);
    } else if (!visible) {
      setEtatValue(null); 
    }
  }, [visible, data]);

  const updateEtatDht11Mutation = useMutation({
    mutationFn: (payload) => axios.put(`/api/dht11/etat/${payload.id}`, { etat: payload.etat }),
    onSuccess: () => {
      toast.current.show({ severity: 'success', summary: 'Succès', detail: "État du capteur DHT11 mis à jour avec succès", life: 3000 });
      queryClient.invalidateQueries(['dht11Data']);
      onRefresh(); 
      onHide();    
    },
    onError: (error) => {
      console.error("Erreur lors du changement d'état du capteur DHT11:", error);
      toast.current.show({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || "Échec du changement d'état", life: 3000 });
    },
  });

  const handleSubmit = async () => { 
    if (data && data.id && etatValue !== null) {
      updateEtatDht11Mutation.mutate({ id: data.id, etat: etatValue });
    } else {
      console.warn("Données ou valeur d'état manquantes pour changer l'état du DHT11.");
      toast.current.show({ severity: 'warn', summary: 'Attention', detail: "Données incomplètes pour changer l'état.", life: 3000 });
    }
  };

  const dialogFooter = (
    <div className="d-flex justify-content-end gap-2">
      <Button label="Annuler" icon="pi pi-times" className="p-button-secondary text-danger" onClick={onHide} />
      <Button 
        label={updateEtatDht11Mutation.isLoading ? "Mise à jour..." : "Confirmer"} 
        icon="pi pi-check" 
        className="p-button-primary text-info" 
        onClick={handleSubmit} 
        disabled={updateEtatDht11Mutation.isLoading}
      /> 
    </div>
  );

  return (
    <Dialog
      header={`Changer l'état du DHT11 : ${data ? data.id : ''}`} 
      visible={visible}
      onHide={onHide}
      modal
      className="p-fluid"
      style={{ width: '30vw' }}
      footer={dialogFooter}
    >
      <div className="p-field mb-3">
        <label htmlFor="etat" className="mb-1">Nouvel État</label>
        <Dropdown
          id="etat"
          value={etatValue}
          onChange={(e) => setEtatValue(e.value)}
          options={[{ label: 'Désactivé', value: 0 }, { label: 'Activé', value: 1 }]}
          placeholder="Sélectionner un état"
        />
      </div>
    </Dialog>
  );
}

export default EtatDht11Modal;