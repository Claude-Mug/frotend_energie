// src/pages/actionneurs/AddActionneursPage.jsx
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'; // <-- Importer Dialog de PrimeReact
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import axios from '../../utils/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Toast } from 'primereact/toast'; // Pour les notifications
import { useRef } from 'react'; // Pour la réf du Toast

// Le composant reçoit `visible` et `onHide` à la place de `id`
function AddActionneurModal({ visible, onHide, onRefresh }) {
  const toast = useRef(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    led_lr: 0,
    led_lb: 0,
    led_lw: 0,
    led_lj: 0,
    moteur: 0,
    action: '',
    zone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumericChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const addActionneurMutation = useMutation({
    mutationFn: (newActionneur) => axios.post('/api/actionneurs', newActionneur),
    onSuccess: () => {
      toast.current.show({ severity: 'success', summary: 'Succès', detail: 'Actionneur ajouté avec succès', life: 3000 });
      queryClient.invalidateQueries(['actionneursData']);
      onRefresh();
      onHide(); // Fermer la modale après succès
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout de l'actionneur:", error);
      toast.current.show({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Échec de l\'ajout', life: 3000 });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addActionneurMutation.mutate(formData);
  };

  const statusOptions = [
    { label: 'Activée', value: 1 },
    { label: 'Désactivée', value: 0 }
  ];

  // Le `footer` pour les boutons de la modale PrimeReact Dialog
  const dialogFooter = (
    <div className="d-flex justify-content-end gap-2">
      <Button label="Annuler" icon="pi pi-times" className="p-button-secondary text-danger" onClick={onHide} />
      <Button label="Ajouter" icon="pi pi-check" type="submit" className='text-info' onClick={handleSubmit} />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Ajouter un nouvel actionneur"
        visible={visible} // Contrôlé par l'état `visible`
        style={{ width: '50vw' }} // Largeur de la modale
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        modal
        className="p-fluid"
        footer={dialogFooter} // Utilisation du footer défini
        onHide={onHide} // Gère la fermeture via le bouton croix ou l'échap
      >
        <form onSubmit={handleSubmit} className="p-grid p-formgrid p-fluid">
          <div className="p-col-12 p-mb-3">
            <label htmlFor="led_lr" className="form-label">LED Rouge</label>
            <Dropdown
              id="led_lr"
              name="led_lr"
              value={formData.led_lr}
              options={statusOptions}
              onChange={(e) => handleNumericChange('led_lr', e.value)}
              placeholder="Sélectionner l'état"
              required
            />
          </div>
          <div className="p-col-12 p-mb-3">
            <label htmlFor="led_lb" className="form-label">LED Bleue</label>
            <Dropdown
              id="led_lb"
              name="led_lb"
              value={formData.led_lb}
              options={statusOptions}
              onChange={(e) => handleNumericChange('led_lb', e.value)}
              placeholder="Sélectionner l'état"
              required
            />
          </div>
          <div className="p-col-12 p-mb-3">
            <label htmlFor="led_lw" className="form-label">LED Blanche</label>
            <Dropdown
              id="led_lw"
              name="led_lw"
              value={formData.led_lw}
              options={statusOptions}
              onChange={(e) => handleNumericChange('led_lw', e.value)}
              placeholder="Sélectionner l'état"
              required
            />
          </div>
          <div className="p-col-12 p-mb-3">
            <label htmlFor="led_lj" className="form-label">LED Jaune</label>
            <Dropdown
              id="led_lj"
              name="led_lj"
              value={formData.led_lj}
              options={statusOptions}
              onChange={(e) => handleNumericChange('led_lj', e.value)}
              placeholder="Sélectionner l'état"
              required
            />
          </div>
          <div className="p-col-12 p-mb-3">
            <label htmlFor="moteur" className="form-label">Moteur</label>
            <Dropdown
              id="moteur"
              name="moteur"
              value={formData.moteur}
              options={statusOptions}
              onChange={(e) => handleNumericChange('moteur', e.value)}
              placeholder="Sélectionner l'état"
              required
            />
          </div>
          <div className="p-col-12 p-mb-3">
            <label htmlFor="action" className="form-label">Action</label>
            <InputText
              id="action"
              name="action"
              value={formData.action}
              onChange={handleChange}
              required
            />
          </div>
          <div className="p-col-12 p-mb-3">
            <label htmlFor="zone" className="form-label">Zone</label>
            <InputText
              id="zone"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              required
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}

export default AddActionneurModal;