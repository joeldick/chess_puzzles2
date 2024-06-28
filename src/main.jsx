import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx';
import { MstProvider } from 'hooks/useMst';
import { rootStore } from './mst/rootStore.js';

const domain = 'dev-7i4e6pens6wu7oe1.us.auth0.com';
const clientId = 'xXdGmepO2VDOntKO6X9y86xjmlKYwQXG';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider domain={domain} clientId={clientId} authorizationParams={{ redirect_uri: window.location.origin }}>
      <MstProvider value={rootStore.create()}>
        <App />
      </MstProvider>
    </Auth0Provider>
  </React.StrictMode>
);
