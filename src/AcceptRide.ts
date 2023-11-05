import { RideDAO } from './RideDAO'
import { AccountDAO } from './AccountDAO'

type Input = {
  driverId: string
  rideId: string
}

export class AcceptRide {
  constructor(
    readonly rideDAO: RideDAO,
    readonly accountDAO: AccountDAO,
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
