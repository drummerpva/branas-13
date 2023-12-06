import { Ride } from '../../domain/Ride'
import { RepositoryFactory } from '../factory/RepositoryFactory'
import { AccountGateway } from '../gateway/AccountGateway'
import { RideRepository } from '../repository/RideRepository'
import { UseCase } from './UseCase'
type Input = {
  passengerId: string
  from: {
    lat: number
    long: number
  }
  to: {
    lat: number
    long: number
  }
  token?: string
}

type Output = {
  rideId: string
}

export class RequestRide implements UseCase {
  private rideRepository: RideRepository
  constructor(
    repositoryFactory: RepositoryFactory,
    readonly accountGateway: AccountGateway,
  ) {
    this.rideRepository = repositoryFactory.createRideRepository()
  }

  async execute(input: Input): Promise<Output> {
    const account = await this.accountGateway.getById(input.passengerId)
    if (!account?.isPassenger) throw new Error('Account is not from passenger')
    const activeRides = await this.rideRepository.getActiveRideByPassengerId(
      input.passengerId,
    )
    if (activeRides.length) throw new Error('Passenger has an active ride')
    const ride = Ride.create(
      input.passengerId,
      input.from.lat,
      input.from.long,
      input.to.lat,
      input.to.long,
    )
    await this.rideRepository.save(ride)
    return { rideId: ride.rideId }
  }
}
