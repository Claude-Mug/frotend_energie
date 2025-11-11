// src/pages/pir/UpdatePirPage.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

function UpdatePirModal({ visible, onHide, data, onRefresh }) {
  const [form, setForm] = useState({
    etat_mouvement: '',
    action: '',
    zone: '',
    etat: 0,
  });

  // Utilisez useEffect pour charger les données de 'data' dans le formulaire lorsque la modale s'ouvre
  useEffect(() => {
    if (visible && data) { // Assurez-vous que la modale est visible et que des données sont passées
      setForm({
        etat_mouvement: data.etat_mouvement || '',
        action: data.action || '',
        zone: data.zone || '',
        etat: data.etat === 1 || data.etat === true || data.etat === '1' ? 1 : 0, // Assurez un 0 ou 1 numérique
      });
    }
  }, [visible, data]); // Déclenchez l'effet lorsque visible ou data changent

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/pir/etat/${data.id}`, form); // Utilisez l'ID de l'élément à mettre à jour
      onRefresh(); // Recharge la liste
      onHide();    // Ferme la modale
    } catch (err) {
      console.error('Erreur lors de la mise à jour :', err);
      // Gérer l'erreur (ex: afficher un toast)
    }
  };

  const dialogFooter = (
    <div className="d-flex justify-content-end gap-2">
      <Button label="Mettre à jour" icon="pi pi-check" className="p-button-info text-black" type="submit" />
      <Button label="Annuler" icon="pi pi-times" className="p-button-secondary bg-info" onClick={onHide} />
    </div>
  );

  return (
    <Dialog
      header="Modifier un PIR"
      visible={visible}
      onHide={onHide}
      modal
      className="p-fluid"
      style={{ width: '40vw' }}
      footer={dialogFooter}
    >
      <form onSubmit={handleSubmit} className="p-grid p-formgrid p-fluid">
        <div className="p-field mb-3">
          <label htmlFor="etat_mouvement" className="mb-1">État Mouvement</label>
          <InputText
            id="etat_mouvement"
            name="etat_mouvement"
            value={form.etat_mouvement}
            onChange={handleChange}
            required
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
            options={[{ label: 'Inactif', value: 0 }, { label: 'Actif', value: 1 }]}
            placeholder="Sélectionner un état"
            required
          />
        </div>
      </form>
    </Dialog>
  );
}

export default UpdatePirModal;