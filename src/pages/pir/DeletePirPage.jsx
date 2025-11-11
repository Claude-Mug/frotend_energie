// src/pages/pir/DeletePirPage.jsx (OPTIONNEL - Utilisez ConfirmDialog directement si possible)

import React from 'react';
import axios from '../../utils/axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

function DeletePirModal({ visible, onHide, data, onRefresh }) {
  const handleDelete = async () => {
    if (data && data.id) {
      try {
        await axios.delete(`/api/pir/${data.id}`);
        onRefresh(); // Recharge la liste
        onHide();    // Ferme la modale
      } catch (err) {
        console.error('Erreur lors de la suppression :', err);
        // Gérer l'erreur
      }
    }
  };

  const dialogFooter = (
    <div className="d-flex justify-content-end gap-2">
      <Button label="Annuler" icon="pi pi-times" className="p-button-secondary text-info" onClick={onHide} />
      <Button label="Supprimer" icon="pi pi-trash" className="p-button-danger text-danger" onClick={handleDelete} />
    </div>
  );

  return (
    <Dialog
      header="Confirmer la suppression"
      visible={visible}
      onHide={onHide}
      modal
      className="p-fluid"
      style={{ width: '30vw' }}
      footer={dialogFooter}
    >
      <div className="d-flex flex-column align-items-center text-center">
        <i className="pi pi-exclamation-triangle text-danger" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
        <p className="lead">
          Voulez-vous vraiment supprimer le capteur PIR avec l'ID : **{data ? data.id : ''}** ?
          Cette action est irréversible.
        </p>
      </div>
    </Dialog>
  );
}

export default DeletePirModal;