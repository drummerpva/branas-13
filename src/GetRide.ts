import { RideDAO } from './RideDAO'
export class GetRide {
  constructor(readonly rideDAO: RideDAO) {}

  async execute(rideId: string) {
    const ride = await this.rideDAO.getById(rideId)
    return ride
  }
}
