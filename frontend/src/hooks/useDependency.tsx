import { createContext, useContext } from 'react'
import { RideGateway } from '../infra/gateway/RideGateway'
import { GeolocationGateway } from '../infra/gateway/GeolocatioGateway'

type DependencyType = {
  rideGateway: RideGateway
  geoLocationGateway: GeolocationGateway
}

const DependencyContext = createContext<DependencyType>({} as DependencyType)
export const DependencyProvider = ({ children, dependency }: any) => (
  <DependencyContext.Provider value={dependency}>
    {children}
  </DependencyContext.Provider>
)

export const useDependency = () => useContext(DependencyContext)
