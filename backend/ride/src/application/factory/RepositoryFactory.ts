import { AccountRepository } from '../repository/AccountRepository'
import { PositionRepository } from '../repository/PositionRepository'
import { RideRepository } from '../repository/RideRepository'

export interface RepositoryFactory {
  createRideRepository(): RideRepository
  createAccountRepository(): AccountRepository
  createPositionRepository(): PositionRepository
}
