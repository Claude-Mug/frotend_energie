// src/pages/actionneurs/ListeActionneursPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../../utils/axios';
import moment from 'moment';

// Importations PrimeReact
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { SlideMenu } from 'primereact/slidemenu';
import { Badge } from 'primereact/badge'; 
import { DataTable } from 'primereact/datatable'; // <-- NOUVEAU : Import de DataTable
import { Column } from 'primereact/column';     // <-- NOUVEAU : Import de Column

// Importation de vos modales (assurez-vous des chemins corrects)
import AddActionneurModal from './AddActionneursPage';
import UpdateActionneurModal from './UpdateActionneursPage';
//import EtatActionneurModal from './EtatActionneurPage'; 

// --- Fonctions de Requêtes de Données ---
export const fetchActionneursData = async () => {
  const res = await axios.get('/api/actionneurs');
  return res.data;
};

// --- Fonction utilitaire pour convertir un état binaire en Badge ---
const binaryToStatusBadge = (value) => {
  const isActive = value === 1 || value === '1' || value === true;

  return isActive ? (
    <Badge value="Activé" severity="success" className="p-badge-md" />
  ) : (
    <Badge value="Désactivé" severity="danger" className="p-badge-md" />
  );
};

// --- Composant Principal : ListeActionneursPage ---
function ListeActionneursPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['actionneursData'],
    queryFn: fetchActionneursData,
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const toast = useRef(null);
  const menu = useRef(null); 

  const [globalLoading, setGlobalLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // États pour contrôler la visibilité des modales PrimeReact
  const [displayAddModal, setDisplayAddModal] = useState(false);
  const [displayEditModal, setDisplayEditModal] = useState(false);
  const [displayEtatModal, setDisplayEtatModal] = useState(false); 

  // --- Fonctions de Rappel (Callbacks) ---

  const getMenuItems = (item) => [
    {
      label: 'Modifier',
      icon: 'pi pi-pencil',
      command: () => {
        setSelectedItem(item);
        setDisplayEditModal(true); 
      }
    },
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      command: () => handleDeletePress([item.id]) 
    },
    { 
      label: 'Changer état',
      icon: 'pi pi-cog',
      command: () => {
        setSelectedItem(item);
        setDisplayEtatModal(true); 
      }
    }
  ];

  const handleDelete = async (ids) => {
    try {
      setGlobalLoading(true);
      await Promise.all(
        ids.map(id => axios.delete(`/api/actionneurs/${id}`))
      );
      toast.current.show({ severity: 'success', summary: 'Succès', detail: 'Actionneur(s) supprimé(s) avec succès', life: 3000 });
      queryClient.invalidateQueries(['actionneursData']);
      refetch();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.current.show({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Échec de la suppression', life: 3000 });
    } finally {
      setGlobalLoading(false);
      setSelectedItems([]);
    }
  };

  const handleDeletePress = (ids) => {
    confirmDialog({
      header: 'Confirmer la suppression',
      message: (
        <div className="d-flex flex-column align-items-center text-center">
          <i className="pi pi-exclamation-triangle text-danger" style={{ fontSize: '3rem', marginBottom: '1rem' }} />
          <span className="lead">
            Voulez-vous vraiment supprimer {ids.length} élément{ids.length > 1 ? 's' : ''} ?
            Cette action est irréversible.
          </span>
        </div>
      ),
      acceptClassName: "p-button-danger text-danger",
      acceptLabel: "Supprimer",
      rejectLabel: "Annuler",
      accept: () => handleDelete(ids),
    });
  };

  // Fonction pour rendre le bouton d'action avec les points de suspension
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="d-flex justify-content-center">
        <Button
          icon="pi pi-ellipsis-v" 
          className="p-button-rounded p-button-text p-button-secondary"
          tooltip="Actions"
          tooltipOptions={{ position: 'left' }}
          onClick={(e) => {
            setSelectedItem(rowData); 
            menu.current.toggle(e); 
          }}
        />
      </div>
    );
  };

  // Fonction pour formater la date/heure
  const datetimeBodyTemplate = (rowData) => {
    return moment(rowData.datetime).format('DD/MM/YYYY HH:mm');
  };

  // --- Contenu de la Toolbar (Barre d'outils) ---
  const leftToolbarContent = () => (
    <div className="d-flex flex-wrap gap-2">
      <Button
        label="Ajouter"
        icon="pi pi-plus"
        className="p-button-secondary text-black p-button-sm"
        onClick={() => setDisplayAddModal(true)} 
      />
      {selectedItems.length > 0 && (
        <Button
          label="Supprimer"
          icon="pi pi-trash"
          className="p-button-danger text-black p-button-sm"
          onClick={() => handleDeletePress(selectedItems.map(item => item.id))}
        />
      )}
    </div>
  );

  const rightToolbarContent = () => (
    <span className="p-input-icon-left text-white">
      <i className="pi pi-search" />
      <InputText
        type="search"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Recherche globale..."
        className="p-inputtext-sm"
        style={{ color: 'white', backgroundColor: '#515253ff', borderColor: '#87bdf3ff' }}
      />
    </span>
  );

  // --- Rendu du Composant ---
  return (
    <div className="py-2">
      <Toast ref={toast} />
      <ConfirmDialog />
      {globalLoading && (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <i className="pi pi-spin pi-spinner text-primary" style={{ fontSize: '3rem' }}></i>
          <p className="lead text-secondary mt-3">Opération en cours...</p>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-white border-bottom-0">
          <h2 className="card-title h4 fw-bold mb-0">Liste des Actionneurs</h2>
        </div>
        <div className="card-body">
          <Toolbar
            left={leftToolbarContent}
            right={rightToolbarContent}
            className="mb-3 bg-dark rounded text-white"
          />

          {isLoading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <i className="pi pi-spin pi-spinner text-primary" style={{ fontSize: '3rem' }}></i>
              <p className="lead text-secondary mt-3">Chargement des données...</p>
            </div>
          ) : isError ? (
            <div className="d-flex flex-column align-items-center justify-content-center p-4">
              <i className="pi pi-exclamation-triangle text-danger" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
              <p className="lead text-secondary">Erreur lors du chargement: <span className="text-danger">{error.message}</span></p>
              <Button
                label="Réessayer"
                icon="pi pi-refresh"
                className="p-button-outlined p-button-sm mt-3"
                onClick={() => refetch()}
              />
            </div>
          ) : (!data || data.length === 0) ? (
            <div className="d-flex flex-column align-items-center justify-content-center p-4">
              <i className="pi pi-database text-muted" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
              <p className="lead text-secondary">Aucune donnée disponible pour le moment.</p>
              <Button
                label="Ajouter un actionneur"
                icon="pi pi-plus"
                className="p-button-primary p-button-sm mt-3"
                onClick={() => setDisplayAddModal(true)}
              />
            </div>
          ) : (
            // REMPLACEMENT DU TABLEAU HTML PAR DATATABLE DE PRIMEREACT
            <DataTable
              value={data}
              paginator // Active la pagination
              rows={10} // Nombre de lignes par page par défaut
              rowsPerPageOptions={[5, 10, 25, 50]} // Options du sélecteur de lignes par page
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} éléments"
              globalFilter={globalFilter} // Filtre global
              selection={selectedItems} // Gère la sélection des lignes
              onSelectionChange={(e) => setSelectedItems(e.value)}
              dataKey="id" // Clé unique pour chaque ligne
              className="p-datatable-striped p-datatable-gridlines w-100" // Styles de la table
              style={{ width: '100%' }}
              emptyMessage="Aucune donnée trouvée avec ce filtre."
              removableSort // Permet de retirer le tri en cliquant plusieurs fois
            >
              {/* COLONNE DE SÉLECTION MULTIPLE */}
              <Column
                selectionMode="multiple"
                headerStyle={{ width: '3rem', backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
              {/* COLONNE ID */}
              <Column
  header="N°"
  field="id"
  sortable
  body={(rowData, options) => {
    // options.props.value est le tableau de données actuellement affiché par la table
    const index = options.props.value.findIndex(item => item.id === rowData.id);
    return index !== -1 ? index + 1 : '';
  }}
  style={{ width: '6rem', textAlign: 'center' }}
  headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
/>
              {/* COLONNE DATE/HEURE */}
              <Column
                field="datetime"
                header="Date/Heure"
                body={datetimeBodyTemplate}
                sortable
                style={{ width: '12rem'}}
                headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
              {/* COLONNES DES ÉTATS DES LEDS ET DU MOTEUR */}
              <Column
                field="led_lr"
                header="LED LR"
                body={(rowData) => binaryToStatusBadge(rowData.led_lr)}
                sortable
                headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
              <Column
                field="led_lb"
                header="LED LB"
                body={(rowData) => binaryToStatusBadge(rowData.led_lb)}
                sortable
                headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
              <Column
                field="led_lw"
                header="LED LW"
                body={(rowData) => binaryToStatusBadge(rowData.led_lw)}
                sortable
                headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
              <Column
                field="led_lj"
                header="LED LJ"
                body={(rowData) => binaryToStatusBadge(rowData.led_lj)}
                sortable
                headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
              <Column
                field="moteur"
                header="Moteur"
                body={(rowData) => binaryToStatusBadge(rowData.moteur)}
                sortable
                headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
              {/* COLONNE ACTION ET ZONE (si elles existent dans vos données) */}
              <Column
                field="action"
                header="Action"
                sortable
                headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
              <Column
                field="zone"
                header="Zone"
                sortable
                headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
              {/* COLONNE ACTIONS AVEC LE BOUTON "..." */}
              <Column
                body={actionBodyTemplate}
                headerStyle={{ width: '5rem', textAlign: 'center', backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
                bodyStyle={{ textAlign: 'center' }}
              />
            </DataTable>
          )}
        </div>
      </div>

      {/* Le SlideMenu de PrimeReact qui s'ouvre au clic du bouton "..." */}
      <SlideMenu
        ref={menu} 
        model={selectedItem ? getMenuItems(selectedItem) : []} 
        popup 
      />

      {/* Modales PrimeReact pour les différentes opérations */}
      <AddActionneurModal
        visible={displayAddModal}
        onHide={() => setDisplayAddModal(false)}
        onRefresh={refetch}
      />
      <UpdateActionneurModal
        visible={displayEditModal}
        onHide={() => setDisplayEditModal(false)}
        data={selectedItem}
        onRefresh={refetch}
      />
      {/* <EtatActionneurModal
        visible={displayEtatModal}
        onHide={() => setDisplayEtatModal(false)}
        data={selectedItem}
        onRefresh={refetch}
      />
      */}
    </div>
  );
}

export default ListeActionneursPage;