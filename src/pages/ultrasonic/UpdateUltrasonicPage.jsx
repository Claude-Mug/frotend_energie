// src/pages/ultrasonic/UpdateUltrasonicPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'; // Importation de Dialog
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber'; // Pour les champs numériques
import axios from '../../utils/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Toast } from 'primereact/toast';

function UpdateUltrasonicModal({ visible, onHide, data, onRefresh }) {
  const toast = useRef(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id: '', // L'ID est important pour la mise à jour
    distance_cm: '',
    etat: '',
    zone: '',
  });

  // Mettre à jour le formulaire lorsque les données changent (quand on ouvre la modale avec un nouvel item)
  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id,
        distance_cm: data.distance_cm,
        etat: data.etat,
        zone: data.zone,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumericChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const updateUltrasonicMutation = useMutation({
    mutationFn: (updatedUltrasonic) => axios.put(`/api/ultrasonic/${updatedUltrasonic.id}`, updatedUltrasonic),
    onSuccess: () => {
      toast.current.show({ severity: 'success', summary: 'Succès', detail: 'Capteur Ultrasonique mis à jour avec succès', life: 3000 });
      queryClient.invalidateQueries(['ultrasonicData']);
      onRefresh();
      onHide();
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du capteur ultrasonique:", error);
      toast.current.show({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Échec de la mise à jour', life: 3000 });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      distance_cm: parseFloat(formData.distance_cm), // Assurez-vous que la distance est un nombre
      etat: parseInt(formData.etat, 10), // Assurez-vous que l'état est un entier (0 ou 1)
    };
    updateUltrasonicMutation.mutate(dataToSend);
  };

  const dialogFooter = (
    <div className="d-flex justify-content-end gap-2">
      <Button label="Annuler" icon="pi pi-times" className="p-button-secondary text-black" onClick={onHide} />
      <Button label="Mettre à jour" icon="pi pi-check" type="submit" className='text-black' onClick={handleSubmit} />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={`Modifier le capteur ultrasonique: ${formData.id}`}
        visible={visible}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        modal
        className="p-fluid"
        footer={dialogFooter}
        onHide={onHide}
      >
        <form onSubmit={handleSubmit} className="p-grid p-formgrid p-fluid">
          <div className="p-col-12 p-mb-3">
            <label htmlFor="id" className="form-label">Id</label>
            <InputText id="id" name="id" value={formData.id} disabled />
          </div>
          <div className="p-col-12 p-mb-3">
            <label htmlFor="distance_cm" className="form-label">Distance</label>
            <InputNumber
              id="distance_cm"
              name="distance_cm"
              value={formData.distance_cm}
              onValueChange={(e) => handleNumericChange('distance_cm', e.value)}
              mode="decimal"
              minFractionDigits={0}
              maxFractionDigits={2}
              required
            />
          </div>
          <div className="p-col-12 p-mb-3">
            <label htmlFor="etat" className="form-label">État (0/1)</label>
            <InputNumber // Ou Dropdown si vous avez des options Activé/Désactivé
              id="etat"
              name="etat"
              value={formData.etat}
              onValueChange={(e) => handleNumericChange('etat', e.value)}
              mode="decimal"
              min={0}
              max={1}
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

export default UpdateUltrasonicModal;