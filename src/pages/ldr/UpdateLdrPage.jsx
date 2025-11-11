// src/pages/ldr/UpdateLdrPage.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useMutation, useQueryClient } from '@tanstack/react-query'; 

function UpdateLdrModal({ visible, onHide, data, onRefresh, toast }) { 
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    luminosite: '',
    action: '',
    zone: '',
    etat: 0,
  });

  useEffect(() => {
    if (visible && data) { 
      setForm({
        luminosite: data.luminosite || '',
        action: data.action || '',
        zone: data.zone || '',
        etat: data.etat === 1 || data.etat === true || data.etat === '1' ? 1 : 0, 
      });
    } else if (!visible) {
      setForm({ 
        luminosite: '',
        action: '',
        zone: '',
        etat: 0,
      });
    }
  }, [visible, data]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateLdrMutation = useMutation({
    mutationFn: (updatedLdr) => axios.put(`/api/ldr/${updatedLdr.id}`, updatedLdr), // Chemin pour la mise à jour
    onSuccess: () => {
      toast.current.show({ severity: 'success', summary: 'Succès', detail: 'Capteur LDR mis à jour avec succès', life: 3000 });
      queryClient.invalidateQueries(['ldrData']);
      onRefresh(); 
      onHide();    
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du capteur LDR:", error);
      toast.current.show({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Échec de la mise à jour', life: 3000 });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!data || !data.id) {
        console.error("Impossible de mettre à jour: ID de l'élément manquant.");
        toast.current.show({ severity: 'error', summary: 'Erreur', detail: "ID de l'élément manquant pour la mise à jour.", life: 3000 });
        return;
    }
    updateLdrMutation.mutate({ ...form, id: data.id }); 
  };

  const dialogFooter = (
    <div className="d-flex justify-content-end gap-2">
      <Button label="Annuler" icon="pi pi-times" className="p-button-secondary" onClick={onHide} />
      <Button 
        label={updateLdrMutation.isLoading ? "Mise à jour..." : "Mettre à jour"} 
        icon="pi pi-check" 
        className="p-button-primary" 
        type="submit" 
        disabled={updateLdrMutation.isLoading} 
      /> 
    </div>
  );

  return (
    <Dialog
      header="Modifier un Capteur LDR"
      visible={visible}
      onHide={onHide}
      modal
      className="p-fluid"
      style={{ width: '40vw' }}
      footer={dialogFooter}
    >
      <form onSubmit={handleSubmit} className="p-grid p-formgrid p-fluid"> 
        <div className="p-field mb-3">
          <label htmlFor="luminosite" className="mb-1">Luminosité</label>
          <InputText
            id="luminosite"
            name="luminosite"
            value={form.luminosite}
            onChange={handleChange}
            required
            type="number"
          />
        </div>
        <div className="p-field mb-3">
          <label htmlFor="action" className="mb-1">Action</label>
          <InputText
            id="action"
            name="action"
            value={form.action}
            onChange={handleChange}
            required
          />
        </div>
        <div className="p-field mb-3">
          <label htmlFor="zone" className="mb-1">Zone</label>
          <InputText
            id="zone"
            name="zone"
            value={form.zone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="p-field">
          <label htmlFor="etat" className="mb-1">État</label>
          <Dropdown
            id="etat"
            name="etat"
            value={form.etat}
            onChange={handleChange}
            options={[{ label: 'Désactivé', value: 0 }, { label: 'Activé', value: 1 }]}
            placeholder="Sélectionner un état"
            required
          />
        </div>
      </form>
    </Dialog>
  );
}

export default UpdateLdrModal;