import { RideDAO } from '../repository/RideDAO'
import { AccountDAO } from '../repository/AccountDAO'
import { Ride } from '../../domain/Ride'
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
    readonly rideDAO: RideDAO,
    readonly accountDAO: AccountDAO,
  ) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountDAO.getById(input.passengerId)
    if (!account?.isPassenger) throw new Error('Account is not from passenger')
    const activeRides = await this.rideDAO.getActiveRideByPassengerId(
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
    await this.rideDAO.save(ride)
    return { rideId: ride.rideId }
  }
}
