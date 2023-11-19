import { Ride } from '../../domain/Ride'
import { AccountRepository } from '../repository/AccountRepository'
import { RideRepository } from '../repository/RideRepository'
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
}

type Output = {
  rideId: string
}

export class RequestRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountRepository: AccountRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getById(input.passengerId)
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
