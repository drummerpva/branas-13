import { RepositoryFactory } from '../../../application/factory/RepositoryFactory'
import { PositionRepository } from '../../../application/repository/PositionRepository'
import { RideRepository } from '../../../application/repository/RideRepository'
import { PositionRepositoryDatabase } from '../../repository/PositionRepositoryDatabase'
import { RideRepositoryDatabase } from '../../repository/RideRepositoryDatabase'
import { Connection } from '../Connection'

export class DatabaseRepositoryFactory implements RepositoryFactory {
  constructor(readonly connection: Connection) {}

  createRideRepository(): RideRepository {
    return new RideRepositoryDatabase(this.connection)
  }

  createPositionRepository(): PositionRepository {
    return new PositionRepositoryDatabase(this.connection)
  }
}
