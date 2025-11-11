// src/pages/pir/AddPirPage.jsx (NOUVEAU - PrimeReact Dialog)
import React, { useState, useEffect } from 'react'; // Garder useEffect si vous avez des props 'data' à initialiser
import axios from '../../utils/axios';
import { Dialog } from 'primereact/dialog'; // Importez Dialog
import { Button } from 'primereact/button'; // Si vous utilisez des boutons PrimeReact dans la modale
import { InputText } from 'primereact/inputtext'; // Pour vos champs de texte
import { Dropdown } from 'primereact/dropdown'; // Pour votre sélecteur d'état

// Assurez-vous d'avoir les imports CSS globaux pour PrimeReact (dans App.jsx ou index.js)
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';

// Utilisez des props 'visible' et 'onHide' pour contrôler la modale
function AddPirModal({ visible, onHide, onRefresh }) {
  const [form, setForm] = useState({
    etat_mouvement: '',
    action: '',
    zone: '',
    etat: 0, // 0 pour inactif, 1 pour actif
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/pir', form);
      onRefresh(); // Recharge la liste
      onHide();    // Ferme la modale via la prop onHide
      setForm({    // Réinitialise le formulaire
        etat_mouvement: '',
        action: '',
        zone: '',
        etat: 0,
      });
    } catch (err) {
      console.error('Erreur lors de l\'ajout :', err);
      // Gérer l'erreur (ex: afficher un toast)
    }
  };

  const dialogFooter = (
    <div className="d-flex justify-content-end text-center gap-2">
      <Button label="Ajouter" icon="pi pi-check" className="p-button-primary bg-info" type="submit" />
      <Button label="Annuler" icon="pi pi-times" className="p-button-secondary bg-danger" onClick={onHide} />
    </div>
  );

  return (
    <Dialog
      header="Ajouter un PIR" // Titre de la modale
      visible={visible}     // Contrôle la visibilité
      onHide={onHide}       // Fonction appelée lors de la fermeture
      modal                 // Rend le fond opaque
      className="p-fluid"   // Applique un style fluide
      style={{ width: '40vw' }} // Ajustez la largeur selon vos besoins
      footer={dialogFooter} // Ajoute le pied de page avec les boutons
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

export default AddPirModal;