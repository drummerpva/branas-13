import { RepositoryFactory } from '../factory/RepositoryFactory'
import { AccountRepository } from '../repository/AccountRepository'
import { RideRepository } from '../repository/RideRepository'

type Input = {
  driverId: string
  rideId: string
}

export class AcceptRide {
  private rideRepository: RideRepository
  private accountRepositry: AccountRepository
  constructor(repositoryFactory: RepositoryFactory) {
    this.rideRepository = repositoryFactory.createRideRepository()
    this.accountRepositry = repositoryFactory.createAccountRepository()
  }

  async execute(input: Input) {
    const account = await this.accountRepositry.getById(input.driverId)
    if (!account?.isDriver) throw new Error('Account is not from driver')
    const ride = await this.rideRepository.getById(input.rideId)
    ride.accept(input.driverId)
    const activeRides = await this.rideRepository.getActiveRideByDriverId(
      input.driverId,
    )
    if (activeRides.length) throw new Error('Driver already has an active ride')
    await this.rideRepository.update(ride)
  }
}
