import { AccountDAO } from '../repository/AccountDAO'
import { RideDAO } from '../repository/RideDAO'
export class GetRide {
  constructor(
    readonly rideDAO: RideDAO,
    readonly accountDAO: AccountDAO,
  ) {}

  async execute(rideId: string) {
    const ride = await this.rideDAO.getById(rideId)
    const passenger = await this.accountDAO.getById(ride.passengerId)
    return Object.assign(ride, { passenger })
  }
}
