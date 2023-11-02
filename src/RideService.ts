import { randomUUID } from 'node:crypto'
import { RideDAO } from './RideDAO'
import { RideDAODatabase } from './RideDAODatabase'
import { AccountDAO } from './AccountDAO'
import { AccountDAODatabase } from './AccountDAODatabase'
export class RideService {
  constructor(
    readonly rideDAO: RideDAO = new RideDAODatabase(),
    readonly accountDAO: AccountDAO = new AccountDAODatabase(),
  ) {}

  async requestRide(input: any) {
    const account = await this.accountDAO.getById(input.passengerId)
    if (!account.is_passenger) throw new Error('Account is not from passenger')
    const activeRides = await this.rideDAO.getActiveRideByPassengerId(
      input.passengerId,
    )
    if (activeRides.length) throw new Error('Passenger has an active ride')
    const rideId = randomUUID()
    const ride = {
      rideId,
      passengerId: input.passengerId,
      status: 'requested',
      date: new Date(),
      from: {
        lat: input.from.lat,
        long: input.from.long,
      },
      to: {
        lat: input.to.lat,
        long: input.to.long,
      },
    }
    await this.rideDAO.save(ride)
    return { rideId }
  }

  async acceptRide(input: any) {
    const account = await this.accountDAO.getById(input.driverId)
    if (!account.is_driver) throw new Error('Account is not from driver')
    const ride = await this.getRide(input.rideId)
    if (ride.status !== 'requested') throw new Error('Ride is not requested')
    const activeRides = await this.rideDAO.getActiveRideByDriverId(
      input.driverId,
    )
    if (activeRides.length) throw new Error('Driver already has an active ride')
    ride.driverId = input.driverId
    ride.rideId = ride.ride_id
    ride.status = 'accepted'
    await this.rideDAO.update(ride)
  }

  async getRide(rideId: string) {
    const ride = await this.rideDAO.getById(rideId)
    return ride
  }
}
