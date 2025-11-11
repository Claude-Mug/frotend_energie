// src/pages/ultrasonic/ListeUltrasonicPage.jsx

// Importations des bibliothèques et des composants nécessaires :
import React, { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Composants PrimeReact UI :
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { SlideMenu } from 'primereact/slidemenu';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from 'primereact/toolbar';
import { Badge } from 'primereact/badge';

// Bibliothèque Moment.js pour le formatage des dates
import moment from 'moment';

// Instance personnalisée d'Axios pour les requêtes HTTP
import axios from '../../utils/axios';

// Composant de chargement personnalisé
import Loading from '../../components/app/Loading';

// Importez les modales mises à jour
import AddUltrasonicModal from './AddUltrasonicPage';
import UpdateUltrasonicModal from './UpdateUltrasonicPage';
import EtatUltrasonicModal from './EtatUltrasonicPage'; // Nouvelle modale d'état

// --- Fonctions de Requêtes de Données ---
// IMPORTANT : Nom de la fonction corrigé à 'fetchUltrasonicData' (sans 's')
export const fetchUltrasonicData = async () => {
  const res = await axios.get('/api/ultrasonic');
  return res.data;
};

// --- Composant Principal : ListeUltrasonicPage ---
function ListeUltrasonicPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['ultrasonicData'], // La clé de la requête peut rester au pluriel pour la cohérence
    queryFn: fetchUltrasonicData, // Appel à la fonction corrigée
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const menu = useRef(null);

  const [globalLoading, setGlobalLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // NOUVEAUX ÉTATS POUR GÉRER LA VISIBILITÉ DES MODALES PRIMEREACT
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
        ids.map(id => axios.delete(`/api/ultrasonic/${id}`))
      );
      queryClient.invalidateQueries(['ultrasonicData']);
      refetch();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      // Gérer l'affichage d'un message d'erreur à l'utilisateur ici
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

  const datetimeBodyTemplate = (rowData) => {
    return moment(rowData.datetime).format('DD/MM/YYYY HH:mm');
  };

  // Fonction pour afficher l'état (Activé/Désactivé)
  const statusBodyTemplate = (rowData) => {
  return rowData.etat === 1 || rowData.etat === true ? ( // <--- Comparaison directe avec nombre ou booléen
    <Badge value="Activé" severity="success" className="p-badge-md" />
  ) : (
    <Badge value="Désactivé" severity="danger" className="p-badge-md" />
  );
};

  // --- Contenu de la Toolbar (Barre d'outils) ---
  const leftToolbarContent = () => (
    <div className="d-flex flex-wrap gap-2">
      <Button
        label="Ajouter"
        icon="pi pi-plus"
        className="p-button-secondary text-black p-button-sm"
        onClick={() => setDisplayAddModal(true)} // Ouvre la modale d'ajout
      />
      <Button
              label="Voir les graphiques"
              icon="pi pi-chart-line"
              className="p-button-info p-button-sm text-black"
              onClick={() => navigate('/ultrasonic/graphiques')}
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
      <ConfirmDialog />
      {globalLoading && <Loading />}

      <div className="card shadow-sm">
        <div className="card-header bg-white border-bottom-0">
          <h2 className="card-title h4 fw-bold mb-0">Liste des Capteurs Ultrasoniques</h2>
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
                label="Ajouter un capteur"
                icon="pi pi-plus"
                className="p-button-primary p-button-sm mt-3"
                onClick={() => setDisplayAddModal(true)}
              />
            </div>
          ) : (
            <DataTable
              value={data}
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
              emptyMessage="Aucune donnée trouvée avec ce filtre."
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
    // options.props.value est le tableau de données actuellement affiché par la table
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
                field="distance_cm"
                header="Distance"
                sortable
                headerStyle={{ backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
              />
              <Column
                field="etat"
                header="État"
                body={statusBodyTemplate}
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
                body={actionBodyTemplate}
                headerStyle={{ width: '5rem', textAlign: 'center', backgroundColor: 'rgba(13, 110, 253, 0.7)', color: 'white' }}
                bodyStyle={{ textAlign: 'center' }}
              />
            </DataTable>
          )}
        </div>
      </div>

      <SlideMenu
        ref={menu}
        model={selectedItem ? getMenuItems(selectedItem) : []}
        popup
      />

      <AddUltrasonicModal
        visible={displayAddModal}
        onHide={() => setDisplayAddModal(false)}
        onRefresh={refetch}
      />
      <UpdateUltrasonicModal
        visible={displayEditModal}
        onHide={() => setDisplayEditModal(false)}
        data={selectedItem}
        onRefresh={refetch}
      />
      <EtatUltrasonicModal
        visible={displayEtatModal}
        onHide={() => setDisplayEtatModal(false)}
        data={selectedItem}
        onRefresh={refetch}
      />
    </div>
  );
}

export default ListeUltrasonicPage;