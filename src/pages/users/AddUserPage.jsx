// src/pages/users/AddUserPage.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classNames } from 'primereact/utils';

function AddUserModal({ visible, onHide, onRefresh, toast }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    mail: '',
    role: 'Client',
    mot_de_passe: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    { label: 'Client', value: 'Client' },
    { label: 'Admin', value: 'admin' },
    { label: 'Technicien', value: 'technicien' },
    { label: 'Observateur', value: 'observateur' }
  ];

  useEffect(() => {
    if (!visible) {
      setForm({
        nom: '',
        prenom: '',
        mail: '',
        role: 'Client',
        mot_de_passe: ''
      });
      setFormErrors({});
    }
  }, [visible]);

  const validateForm = () => {
    const errors = {};
    if (!form.nom.trim()) errors.nom = 'Nom requis';
    if (!form.prenom.trim()) errors.prenom = 'Prénom requis';
    if (!form.mail.trim()) {
      errors.mail = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.mail)) {
      errors.mail = 'Email invalide';
    }
    if (!form.mot_de_passe) {
      errors.mot_de_passe = 'Mot de passe requis';
    } else if (form.mot_de_passe.length < 6) {
      errors.mot_de_passe = '6 caractères minimum';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const addUserMutation = useMutation({
    mutationFn: (newUser) => axios.post('/api/users', newUser),
    onSuccess: () => {
      toast.current.show({ 
        severity: 'success', 
        summary: 'Succès', 
        detail: 'Utilisateur ajouté avec succès', 
        life: 3000 
      });
      queryClient.invalidateQueries(['userData']);
      onRefresh();
      onHide();
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.error || 
                      error.response?.data?.message || 
                      "Échec de l'ajout de l'utilisateur";
      
      toast.current.show({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: errorMsg, 
        life: 5000 
      });
    },
    onSettled: () => setIsSubmitting(false)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    addUserMutation.mutate(form);
  };

  return (
    <Dialog
      header="Ajouter un Utilisateur"
      visible={visible}
      onHide={onHide}
      modal
      className="p-fluid"
      style={{ width: '40vw' }}
    >
      <form onSubmit={handleSubmit} className="p-grid p-formgrid p-fluid">
        <div className="p-field mb-3">
          <label htmlFor="nom" className="mb-1">Nom *</label>
          <InputText
            id="nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            className={classNames({ 'p-invalid': formErrors.nom })}
          />
          {formErrors.nom && <small className="p-error">{formErrors.nom}</small>}
        </div>
        
        <div className="p-field mb-3">
          <label htmlFor="prenom" className="mb-1">Prénom *</label>
          <InputText
            id="prenom"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            className={classNames({ 'p-invalid': formErrors.prenom })}
          />
          {formErrors.prenom && <small className="p-error">{formErrors.prenom}</small>}
        </div>
        
        <div className="p-field mb-3">
          <label htmlFor="mail" className="mb-1">Email *</label>
          <InputText
            id="mail"
            name="mail"
            value={form.mail}
            onChange={handleChange}
            type="email"
            className={classNames({ 'p-invalid': formErrors.mail })}
          />
          {formErrors.mail && <small className="p-error">{formErrors.mail}</small>}
        </div>
        
        <div className="p-field mb-3">
          <label htmlFor="mot_de_passe" className="mb-1">Mot de passe *</label>
          <Password
            id="mot_de_passe"
            name="mot_de_passe"
            value={form.mot_de_passe}
            onChange={handleChange}
            toggleMask
            feedback={false}
            className={classNames({ 'p-invalid': formErrors.mot_de_passe })}
          />
          {formErrors.mot_de_passe && (
            <small className="p-error">{formErrors.mot_de_passe}</small>
          )}
        </div>
        
        <div className="p-field mb-4">
          <label htmlFor="role" className="mb-1">Rôle</label>
          <Dropdown
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            options={roles}
            placeholder="Sélectionner un rôle"
          />
        </div>
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button
            label="Annuler"
            icon="pi pi-times"
            className="p-button-secondary text-info"
            onClick={onHide}
            disabled={isSubmitting}
          />
          <Button
            label={isSubmitting ? "Traitement..." : "Ajouter"}
            icon="pi pi-check"
            className="p-button-primary text-black"
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
          />
        </div>
      </form>
    </Dialog>
  );
}

export default AddUserModal;