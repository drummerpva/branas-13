import { RideDAO } from './RideDAO'
import { RideDAODatabase } from './RideDAODatabase'
import { AccountDAO } from './AccountDAO'
import { AccountDAODatabase } from './AccountDAODatabase'

type Input = {
  driverId: string
  rideId: string
}

export class AcceptRide {
  constructor(
    readonly rideDAO: RideDAO = new RideDAODatabase(),
    readonly accountDAO: AccountDAO = new AccountDAODatabase(),
  ) {}

  async execute(input: Input) {
    const account = await this.accountDAO.getById(input.driverId)
    if (!account?.isDriver) throw new Error('Account is not from driver')
    const ride = await this.rideDAO.getById(input.rideId)
    ride.accept(input.driverId)
    const activeRides = await this.rideDAO.getActiveRideByDriverId(
      input.driverId,
    )
    if (activeRides.length) throw new Error('Driver already has an active ride')
    await this.rideDAO.update(ride)
  }
}
