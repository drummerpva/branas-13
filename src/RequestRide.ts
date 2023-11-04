import { RideDAO } from './RideDAO'
import { RideDAODatabase } from './RideDAODatabase'
import { AccountDAO } from './AccountDAO'
import { AccountDAODatabase } from './AccountDAODatabase'
import { Ride } from './Ride'
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
    readonly rideDAO: RideDAO = new RideDAODatabase(),
    readonly accountDAO: AccountDAO = new AccountDAODatabase(),
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