import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './views/App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="dev-yumjf2ozrxs1cvvo.us.auth0.com"
        clientId="VdWGwIeYrr5W35Atr89IxSQAhiERWK6S"
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        <App />
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>,
)
