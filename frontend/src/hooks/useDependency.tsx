import { createContext, useContext } from 'react'
import { RideGateway } from '../infra/gateway/RideGateway'

type DependencyType = {
  rideGateway: RideGateway
}

const DependencyContext = createContext<DependencyType>({} as DependencyType)
export const DependencyProvider = ({ children, dependency }: any) => (
  <DependencyContext.Provider value={dependency}>
    {children}
  </DependencyContext.Provider>
)

export const useDependency = () => useContext(DependencyContext)
