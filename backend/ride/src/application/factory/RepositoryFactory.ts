import { PositionRepository } from '../repository/PositionRepository'
import { RideRepository } from '../repository/RideRepository'

export interface RepositoryFactory {
  createRideRepository(): RideRepository
  createPositionRepository(): PositionRepository
}
