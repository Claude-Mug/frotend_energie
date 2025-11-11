// src/pages/users/UpdateUserPage.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { classNames } from 'primereact/utils';

function UpdateUserModal({ visible, onHide, userId, onRefresh, toast }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    mail: '',
    role: 'Client'
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérer les données de l'utilisateur via API
  const { data: userData, isLoading, isError, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await axios.get(`/api/users/${userId}`);
      return response.data;
    },
    enabled: !!userId && visible, // Activer seulement si userId existe et modale visible
    staleTime: 0,
    retry: false
  });

  const roles = [
    { label: 'Client', value: 'Client' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Technicien', value: 'Technicien' },
    { label: 'Observateur', value: 'Observateur' }
  ];

  // Mettre à jour le formulaire quand les données sont chargées
  useEffect(() => {
    if (userData) {
      setForm({
        nom: userData.nom || '',
        prenom: userData.prenom || '',
        mail: userData.mail || '',
        role: userData.role || 'Client'
      });
    }
  }, [userData]);

  // Réinitialiser quand la modale est fermée
  useEffect(() => {
    if (!visible) {
      setForm({ nom: '', prenom: '', mail: '', role: 'Client' });
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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur quand l'utilisateur tape
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const updateUserMutation = useMutation({
    mutationFn: (updatedUser) => axios.put(`/api/users/${updatedUser.id}`, updatedUser),
    onSuccess: () => {
      toast.current.show({ 
        severity: 'success', 
        summary: 'Succès', 
        detail: 'Utilisateur mis à jour avec succès', 
        life: 3000 
      });
      queryClient.invalidateQueries(['userData']);
      onRefresh();
      onHide();
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.error || 
                      error.response?.data?.message || 
                      "Échec de la mise à jour";
      
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
    if (!userId) {
      toast.current.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'ID utilisateur manquant pour la mise à jour',
        life: 3000
      });
      return;
    }
    
    setIsSubmitting(true);
    updateUserMutation.mutate({ ...form, id: userId });
  };

  // Si chargement des données
  if (isLoading) {
    return (
      <Dialog
        header="Chargement..."
        visible={visible}
        onHide={onHide}
        modal
        className="p-fluid"
        style={{ width: '40vw' }}
      >
        <div className="flex align-items-center justify-content-center p-5">
          <i className="pi pi-spin pi-spinner text-primary" style={{ fontSize: '2rem' }}></i>
          <p className="ml-3">Chargement des données utilisateur...</p>
        </div>
      </Dialog>
    );
  }

  // Si erreur de chargement
  if (isError) {
    return (
      <Dialog
        header="Erreur"
        visible={visible}
        onHide={onHide}
        modal
        className="p-fluid"
        style={{ width: '40vw' }}
      >
        <div className="text-center p-5">
          <i className="pi pi-exclamation-triangle text-danger" style={{ fontSize: '2rem' }}></i>
          <p className="mt-3">Échec du chargement des données</p>
          <p className="text-secondary">{error.message}</p>
          <Button
            label="Réessayer"
            icon="pi pi-refresh"
            className="p-button-outlined p-button-sm mt-3"
            onClick={() => queryClient.refetchQueries(['user', userId])}
          />
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      header={userData ? `Modifier ${userData.prenom} ${userData.nom}` : 'Modifier un utilisateur'}
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
        
        <div className="p-field mb-4">
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
            label={isSubmitting ? "Mise à jour..." : "Mettre à jour"}
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

export default UpdateUserModal;