// src/pages/pir/ListePirPage.jsx

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
import { DataTable } from 'primereact/datatable'; 
import { Column } from 'primereact/column';     

// Importation de vos modales et de la nouvelle modale de filtre
import AddPirModal from './AddPirPage';        
import UpdatePirModal from './UpdatePirPage';  
import EtatPirModal from './EtatPirPage';      
import PirFilterModal from './PirFilterModal'; 

// --- Fonctions de Requêtes de Données ---
export const fetchPirData = async () => {
  const res = await axios.get('/api/pir');
  return res.data;
};

// --- Fonction utilitaire pour convertir un état binaire en Badge ---
const etatBodyTemplate = (value) => {
  const isActive = (value === 1 || value === '1' || value === true);
  
  return isActive ? (
    <Badge value="Actif" severity="success" className="p-badge-md" />
  ) : (
    <Badge value="Inactif" severity="danger" className="p-badge-md" />
  );
};

// --- Composant Principal : ListePirPage ---
function ListePirPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['pirData'],
    queryFn: fetchPirData,
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
  const [displayFilterModal, setDisplayFilterModal] = useState(false);
  
  // Nouveaux états pour le filtrage
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    // Initialiser filteredData avec toutes les données lorsque la page se charge
    if (data) {
      setFilteredData(data);
      if (data.length > 0) {
        setStartDate(moment(data[0].datetime).toDate());
        setEndDate(moment(data[data.length - 1].datetime).toDate());
      }
    }
  }, [data]);

  const handleApplyFilter = (start, end, startTime, endTime) => {
    console.log("Déclenchement du filtre avec :", { start, end, startTime, endTime });
    if (!start || !end) {
      setFilteredData(data);
      return;
    }
  
    const startDateTime = moment(start).set({
      'hour': moment(startTime, 'HH:mm').hour(),
      'minute': moment(startTime, 'HH:mm').minute(),
      'second': 0
    });
    const endDateTime = moment(end).set({
      'hour': moment(endTime, 'HH:mm').hour(),
      'minute': moment(endTime, 'HH:mm').minute(),
      'second': 59
    });
  
    if (startDateTime.isSameOrBefore(endDateTime)) {
      const records = data.filter(d => {
        const recordDateTime = moment(d.datetime);
        return recordDateTime.isBetween(startDateTime, endDateTime, null, '[]');
      });
      setFilteredData(records);
    } else {
      setFilteredData([]);
    }
    // Mettre à jour les dates pour l'affichage dans la modale
    setStartDate(start);
    setEndDate(end);
  };

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
        ids.map(id => axios.delete(`/api/pir/${id}`))
      );
      toast.current.show({ severity: 'success', summary: 'Succès', detail: 'PIR(s) supprimé(s) avec succès', life: 3000 });
      queryClient.invalidateQueries(['pirData']);
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
      acceptClassName: "p-button-danger",
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

  const clearFilter = () => {
    setFilteredData(data);
    setGlobalFilter('');
    if (data.length > 0) {
      setStartDate(moment(data[0].datetime).toDate());
      setEndDate(moment(data[data.length - 1].datetime).toDate());
    }
  }

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
      <Button
        label="Filtrer par date"
        icon="pi pi-calendar"
        className="p-button-secondary text-black p-button-sm"
        onClick={() => setDisplayFilterModal(true)}
      />
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
      <Button
        icon="pi pi-times"
        className="p-button-rounded p-button-text p-button-sm p-button-secondary"
        tooltip="Effacer les filtres"
        onClick={clearFilter}
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
          <h2 className="card-title h4 fw-bold mb-0">Liste des Capteurs PIR</h2>
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
                label="Ajouter un capteur PIR"
                icon="pi pi-plus"
                className="p-button-primary p-button-sm mt-3"
                onClick={() => setDisplayAddModal(true)}
              />
            </div>
          ) : (
            <DataTable
              value={filteredData}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} éléments"
              globalFilter={globalFilter}
              selection={selectedItems}
              onSelectionChange={(e) => setSelectedItems(e.value)}
              dataKey="id"
              className="p-datatable-striped p-datatable-gridlines w-100"
              style={{ width: '100%' }}
              emptyMessage="Aucun enregistrement trouvé pour la période sélectionnée."
              removableSort
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: '3rem', backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
              <Column
                header="N°"
                field="id"
                sortable
                body={(rowData, options) => {
                  const index = options.props.value.findIndex(item => item.id === rowData.id);
                  return index !== -1 ? index + 1 : '';
                }}
                style={{ width: '6rem', textAlign: 'center' }}
                headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
              <Column
                field="datetime"
                header="Date/Heure"
                body={datetimeBodyTemplate}
                sortable
                style={{ width: '12rem'}}
                headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
              <Column
                field="etat_mouvement"
                header="État Mouvement"
                body={(rowData) => etatBodyTemplate(rowData.etat_mouvement)} 
                sortable
                headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
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
              <Column
                field="etat"
                header="État"
                body={(rowData) => etatBodyTemplate(rowData.etat)} 
                sortable
                headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
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
      <AddPirModal
        visible={displayAddModal}
        onHide={() => setDisplayAddModal(false)}
        onRefresh={refetch}
      />
      <UpdatePirModal
        visible={displayEditModal}
        onHide={() => setDisplayEditModal(false)}
        data={selectedItem}
        onRefresh={refetch}
      />
      <EtatPirModal
        visible={displayEtatModal}
        onHide={() => setDisplayEtatModal(false)}
        data={selectedItem}
        onRefresh={refetch}
      />
      <PirFilterModal
        visible={displayFilterModal}
        onHide={() => setDisplayFilterModal(false)}
        onApplyFilter={handleApplyFilter}
        data={data}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
    </div>
  );
}

export default ListePirPage;