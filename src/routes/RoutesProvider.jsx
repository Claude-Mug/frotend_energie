// src/routes/RoutesProvider.jsx (ou RoutesContent.jsx)

// NE PLUS IMPORTER BrowserRouter ici, seulement Routes et Route
import { Routes, Route } from 'react-router-dom' 

import DashboardPage from '../pages/Dashboard/DashboardPage';
import ListeUltrasonicPage from '../pages/ultrasonic/ListeUltrasonicPage'
import ListePirPage from '../pages/pir/ListePirPage'
import ListeDht11Page from '../pages/dht11/ListeDht11Page'
import ListeLdrPage from '../pages/ldr/ListeLdrPage'
import ListeActionneursPage from '../pages/actionneurs/ListeActionneursPage'
import ListeUsersPage from '../pages/users/ListeUsersPage';
import GraphiqueDht11Page from '../pages/dht11/GraphiqueDht11Page';
import GraphiqueLdrPage from '../pages/ldr/GraphiqueLdrPage';
import GraphiqueUltrasonicPage from '../pages/ultrasonic/GraphiqueUltrasonicPage';

function RoutesProvider() { // Gardez le même nom de fonction si vous préférez
  return (
    // Les <Routes> doivent être des enfants directs d'un <Router> (maintenant dans App.jsx)
    <Routes>
      {/* Route par défaut : affiche le DashboardPage */}
      <Route path="/" element={<DashboardPage />} />
      {/* Une route explicite pour le Dashboard (optionnel mais utile) */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/ultrasonic" element={<ListeUltrasonicPage />} />
      <Route path="/pir" element={<ListePirPage />} />
      <Route path="/dht11" element={<ListeDht11Page />} />
      <Route path="/ldr" element={<ListeLdrPage />} />
      <Route path="/actionneurs" element={<ListeActionneursPage />} />
      <Route path="/users" element={<ListeUsersPage />} />
      <Route path="/dht11/graphiques" element={<GraphiqueDht11Page />} />
      <Route path="/ldr/graphiques" element={<GraphiqueLdrPage />} />
      <Route path="/ultrasonic/graphiques" element={<GraphiqueUltrasonicPage />} />
      {/* Optionnel : Une route par défaut pour la page d'accueil */}
      {/* <Route path="/" element={<HomePage />} /> */}
    </Routes>
  )
}

export default RoutesProvider