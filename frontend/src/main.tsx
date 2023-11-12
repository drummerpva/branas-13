import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RideGatewayHttp } from './infra/gateway/RideGatewayHttp.ts'
import { DependencyProvider } from './hooks/useDependency.tsx'
// import { AxiosAdapter } from './infra/http/AxiosAdapter.ts'
import { FetchAdapter } from './infra/http/FetchAdapter.ts'
import { GeolocationGatewayBrowser } from './infra/gateway/GeolocationGatewayBrowser.ts'

// const httpClient = new AxiosAdapter()
const httpClient = new FetchAdapter()
const rideGateway = new RideGatewayHttp(httpClient)
const geoLocationGateway = new GeolocationGatewayBrowser()
const dependency = {
  rideGateway,
  geoLocationGateway,
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DependencyProvider dependency={dependency}>
      <App />
    </DependencyProvider>
  </React.StrictMode>,
)
