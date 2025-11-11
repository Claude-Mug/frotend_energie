// src/pages/ldr/EtatLdrPage.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useMutation, useQueryClient } from '@tanstack/react-query'; 

function EtatLdrModal({ visible, onHide, data, onRefresh, toast }) { 
  const queryClient = useQueryClient();
  const [etatValue, setEtatValue] = useState(null);

  useEffect(() => {
    if (visible && data) {
      setEtatValue(data.etat === 1 || data.etat === true || data.etat === '1' ? 1 : 0);
    } else if (!visible) {
      setEtatValue(null); 
    }
  }, [visible, data]);

  const updateEtatLdrMutation = useMutation({
    mutationFn: (payload) => axios.put(`/api/ldr/${payload.id}/etat`, { etat: payload.etat }), // Chemin pour le changement d'état
    onSuccess: () => {
      toast.current.show({ severity: 'success', summary: 'Succès', detail: "État du capteur LDR mis à jour avec succès", life: 3000 });
      queryClient.invalidateQueries(['ldrData']);
      onRefresh(); 
      onHide();    
    },
    onError: (error) => {
      console.error("Erreur lors du changement d'état du capteur LDR:", error);
      toast.current.show({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || "Échec du changement d'état", life: 3000 });
    },
  });

  const handleSubmit = async () => { 
    if (data && data.id && etatValue !== null) {
      updateEtatLdrMutation.mutate({ id: data.id, etat: etatValue });
    } else {
      console.warn("Données ou valeur d'état manquantes pour changer l'état du LDR.");
      toast.current.show({ severity: 'warn', summary: 'Attention', detail: "Données incomplètes pour changer l'état.", life: 3000 });
    }
  };

  const dialogFooter = (
    <div className="d-flex justify-content-end gap-2">
      <Button label="Annuler" icon="pi pi-times" className="p-button-secondary" onClick={onHide} />
      <Button 
        label={updateEtatLdrMutation.isLoading ? "Mise à jour..." : "Confirmer"} 
        icon="pi pi-check" 
        className="p-button-primary" 
        onClick={handleSubmit} 
        disabled={updateEtatLdrMutation.isLoading}
      /> 
    </div>
  );

  return (
    <Dialog
      header={`Changer l'état du LDR : ${data ? data.id : ''}`} 
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

export default EtatLdrModal;