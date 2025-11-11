// src/pages/dht11/AddDht11Page.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Importez useMutation et useQueryClient

function AddDht11Modal({ visible, onHide, onRefresh, toast }) { // Ajoutez toast en prop
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    temperature: '',
    humidite: '',
    action: '',
    zone: '',
    etat: 0, 
  });

  useEffect(() => {
    if (!visible) {
      setForm({
        temperature: '',
        humidite: '',
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

  const addDht11Mutation = useMutation({
    mutationFn: (newDht11) => axios.post('/api/dht11', newDht11),
    onSuccess: () => {
      toast.current.show({ severity: 'success', summary: 'Succès', detail: 'Capteur DHT11 ajouté avec succès', life: 3000 });
      queryClient.invalidateQueries(['dht11Data']); // Invalide la cache pour rafraîchir la liste
      onRefresh(); // Appel pour rafraîchir le tableau (même effet que invalidateQueries ici)
      onHide();    // Ferme la modale
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout du capteur DHT11:", error);
      toast.current.show({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || "Échec de l'ajout", life: 3000 });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    addDht11Mutation.mutate(form); // Déclenche la mutation
  };

  const dialogFooter = (
    <div className="d-flex justify-content-end gap-2">
      <Button label="Annuler" icon="pi pi-times" className="p-button-secondary" onClick={onHide} />
      <Button 
        label={addDht11Mutation.isLoading ? "Ajout en cours..." : "Ajouter"} 
        icon="pi pi-check" 
        className="p-button-primary" 
        type="submit" 
        disabled={addDht11Mutation.isLoading} // Désactive le bouton pendant la soumission
      /> 
    </div>
  );

  return (
    <Dialog
      header="Ajouter un Capteur DHT11" 
      visible={visible}     
      onHide={onHide}       
      modal                 
      className="p-fluid"   
      style={{ width: '40vw' }} 
      footer={dialogFooter} 
    >
      <form onSubmit={handleSubmit} className="p-grid p-formgrid p-fluid"> 
        <div className="p-field mb-3">
          <label htmlFor="temperature" className="mb-1">Température</label>
          <InputText
            id="temperature"
            name="temperature"
            value={form.temperature}
            onChange={handleChange}
            required
            type="number" // Assurez-vous que c'est un nombre
          />
        </div>
        <div className="p-field mb-3">
          <label htmlFor="humidite" className="mb-1">Humidité</label>
          <InputText
            id="humidite"
            name="humidite"
            value={form.humidite}
            onChange={handleChange}
            required
            type="number" // Assurez-vous que c'est un nombre
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

export default AddDht11Modal;