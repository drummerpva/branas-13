import { RideDAO } from '../repository/RideDAO'

type Input = {
  rideId: string
  lat: number
  long: number
}

export class UpdatePosition {
  constructor(readonly rideDAO: RideDAO) {}

  async execute(input: Input) {
    const ride = await this.rideDAO.getById(input.rideId)
    ride.updatePosition(input.lat, input.long)
    await this.rideDAO.update(ride)
  }
}
