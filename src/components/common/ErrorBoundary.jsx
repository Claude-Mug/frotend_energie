// src/components/common/ErrorBoundary.jsx

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour que le prochain rendu affiche l'UI de secours.
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez aussi loguer l'erreur dans un service de reporting d'erreurs
    console.error("Erreur détectée par la limite d'erreur :", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez rendre n'importe quelle UI de secours.
      return (
        <div className="alert alert-danger p-4 m-4" role="alert">
          <h4 className="alert-heading">Un problème est survenu !</h4>
          <p>L'application a rencontré une erreur. Veuillez réessayer ou contacter le support.</p>
          <hr />
          <p className="mb-0">Détails de l'erreur (pour le diagnostic) :</p>
          <pre className="text-wrap">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;