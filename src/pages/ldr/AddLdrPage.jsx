// src/pages/ldr/AddLdrPage.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useMutation, useQueryClient } from '@tanstack/react-query'; 

function AddLdrModal({ visible, onHide, onRefresh, toast }) { 
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    luminosite: '',
    action: '',
    zone: '',
    etat: 0, 
  });

  useEffect(() => {
    if (!visible) {
      setForm({
        luminosite: '',
        action: '',
        zone: '',
        etat: 0,
      });
    }
  }, [visible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addLdrMutation = useMutation({
    mutationFn: (newLdr) => axios.post('/api/ldr', newLdr), // Chemin pour l'ajout
    onSuccess: () => {
      toast.current.show({ severity: 'success', summary: 'Succès', detail: 'Capteur LDR ajouté avec succès', life: 3000 });
      queryClient.invalidateQueries(['ldrData']); 
      onRefresh(); 
      onHide();    
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout du capteur LDR:", error);
      toast.current.show({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || "Échec de l'ajout", life: 3000 });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    addLdrMutation.mutate(form); 
  };

  const dialogFooter = (
    <div className="d-flex justify-content-end gap-2">
      <Button label="Annuler" icon="pi pi-times" className="p-button-secondary text-info" onClick={onHide} />
      <Button 
        label={addLdrMutation.isLoading ? "Ajout en cours..." : "Ajouter"} 
        icon="pi pi-check" 
        className="p-button-primary text-black" 
        type="submit" 
        disabled={addLdrMutation.isLoading} 
      /> 
    </div>
  );

  return (
    <Dialog
      header="Ajouter un Capteur LDR" 
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

export default AddLdrModal;