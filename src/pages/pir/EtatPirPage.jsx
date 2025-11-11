// src/pages/pir/EtatPirPage.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

function EtatPirModal({ visible, onHide, data, onRefresh }) {
  const [etatValue, setEtatValue] = useState(null);

  // Initialise l'état local avec la valeur actuelle du capteur lorsque la modale s'ouvre
  useEffect(() => {
    if (visible && data) {
      // Assurez-vous que la valeur est 0 ou 1 pour le Dropdown
      setEtatValue(data.etat === 1 || data.etat === true || data.etat === '1' ? 1 : 0);
    }
  }, [visible, data]);

  const handleSubmit = async () => {
    if (data && etatValue !== null) {
      try {
        await axios.put(`/api/pir/etat/${data.id}`, { etat: etatValue }); // Point de terminaison API pour changer l'état
        onRefresh(); // Recharge la liste pour refléter le changement
        onHide();    // Ferme la modale
      } catch (err) {
        console.error('Erreur lors du changement d\'état :', err);
        // Gérer l'erreur
      }
    }
  };

  const dialogFooter = (
    <div className="d-flex justify-content-end gap-2">
      <Button label="Annuler" icon="pi pi-times" className="p-button-secondary text-info" onClick={onHide} />
      <Button label="Confirmer" icon="pi pi-check" className="p-button-primary text-black" onClick={handleSubmit} />
    </div>
  );

  return (
    <Dialog
      header={`Changer l'état du PIR : ${data ? data.id : ''}`} // Affiche l'ID du capteur
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
          options={[{ label: 'Inactif', value: 0 }, { label: 'Actif', value: 1 }]}
          placeholder="Sélectionner un état"
        />
      </div>
    </Dialog>
  );
}

export default EtatPirModal;