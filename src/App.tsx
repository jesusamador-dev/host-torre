import React, {useState} from 'react';
import { createRoot } from 'react-dom/client';
import MainStyles from 'mf_mesacyc_dashboards_common/MainStyles';
import AuthProvider from 'mf_mesacyc_dashboards_common/AuthProvider';
import RouterApp from './app/router/RouterApp';
import GlobalProvider from '@/providers/GlobalProvider';

const App = () => {
  return (
    <AuthProvider>
      <GlobalProvider>
          <MainStyles>
            <RouterApp />
          </MainStyles>
      </GlobalProvider>
    </AuthProvider>
  );
};

// Selecciona el elemento raíz
const container = document.getElementById('app');

// Verifica que el contenedor exista antes de inicializar el renderizado
if (container) {
  const root = createRoot(container); // Método de React 18 para crear el root
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

/** Para propósitos de prueba */
export default App;
