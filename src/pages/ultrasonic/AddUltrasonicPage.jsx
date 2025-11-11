import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import axios from '../../utils/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Toast } from 'primereact/toast';

function AddUltrasonicModal({ visible, onHide, onRefresh }) {
  const toast = useRef(null);
  const queryClient = useQueryClient();

  const etatOptions = [
    { label: 'Activé', value: true },
    { label: 'Désactivé', value: false }
  ];

  // Ajout du champ action dans l'état initial
  const [formData, setFormData] = useState({
    distance_cm: null,
    etat: true,
    zone: '',
    action: '' // Nouveau champ requis
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumericChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const addUltrasonicMutation = useMutation({
    mutationFn: (newUltrasonic) => axios.post('/api/ultrasonic', newUltrasonic),
    onSuccess: () => {
      toast.current.show({ 
        severity: 'success', 
        summary: 'Succès', 
        detail: 'Capteur ajouté avec succès', 
        life: 3000 
      });
      queryClient.invalidateQueries(['ultrasonicData']);
      onRefresh();
      onHide();
      setFormData({
        distance_cm: null,
        etat: true,
        zone: '',
        action: '' // Réinitialisation du nouveau champ
      });
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout:", error);
      toast.current.show({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: error.response?.data?.message || 'Échec de l\'ajout', 
        life: 5000 
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation étendue au nouveau champ action
    if (formData.distance_cm === null || 
        formData.zone.trim() === '' || 
        formData.action.trim() === '') {
      toast.current.show({
        severity: 'error',
        summary: 'Champs manquants',
        detail: 'Veuillez remplir tous les champs obligatoires',
        life: 3000
      });
      return;
    }

    const payload = {
      distance_cm: parseFloat(formData.distance_cm),
      etat: formData.etat,
      zone: formData.zone,
      action: formData.action // Ajout du champ action
    };

    addUltrasonicMutation.mutate(payload);
  };

  return (
    <>
      <Toast ref={toast} position="top-center" />
      <Dialog
        header="Ajouter un nouveau capteur ultrasonique"
        visible={visible}
        style={{ width: '50vw', minWidth: '300px' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        modal
        className="p-fluid"
        onHide={onHide}
        dismissableMask
      >
        <form onSubmit={handleSubmit} className="p-grid p-formgrid p-fluid">
          <div className="p-field p-col-12 p-mb-4">
            <label htmlFor="distance_cm" className="font-medium block mb-2">
              Distance (cm) <span className="text-red-500">*</span>
            </label>
            <InputNumber
              id="distance_cm"
              value={formData.distance_cm}
              onValueChange={(e) => handleNumericChange('distance_cm', e.value)}
              mode="decimal"
              min={0}
              max={1000}
              minFractionDigits={0}
              maxFractionDigits={2}
              placeholder="Entrez la distance"
              className="w-full"
              inputClassName="w-full"
              required
            />
          </div>
          
          {/* Nouveau champ Action */}
          <div className="p-field p-col-12 p-mb-4">
            <label htmlFor="action" className="font-medium block mb-2">
              Action <span className="text-red-500">*</span>
            </label>
            <InputText
              id="action"
              name="action"
              value={formData.action}
              onChange={handleChange}
              placeholder="Entrez l'action effectuée"
              className="w-full"
              required
            />
          </div>
          
          <div className="p-field p-col-12 p-mb-4">
            <label htmlFor="etat" className="font-medium block mb-2">
              État <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="etat"
              value={formData.etat}
              options={etatOptions}
              onChange={(e) => setFormData({...formData, etat: e.value})}
              placeholder="Sélectionnez un état"
              className="w-full"
              required
            />
          </div>
          
          <div className="p-field p-col-12 p-mb-4">
            <label htmlFor="zone" className="font-medium block mb-2">
              Zone <span className="text-red-500">*</span>
            </label>
            <InputText
              id="zone"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              placeholder="Entrez la zone"
              className="w-full"
              required
            />
          </div>
          
          <div className="p-col-12 flex justify-content-end gap-3 mt-4">
            <Button
              label="Annuler"
              icon="pi pi-times"
              className="p-button-secondary p-button-outlined text-info"
              onClick={onHide}
              disabled={addUltrasonicMutation.isLoading}
            />
            <Button
              label={addUltrasonicMutation.isLoading ? "Traitement..." : "Ajouter"}
              icon="pi pi-check"
              className="p-button-success text-black"
              type="submit"
              disabled={addUltrasonicMutation.isLoading}
              loading={addUltrasonicMutation.isLoading}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}

export default AddUltrasonicModal;