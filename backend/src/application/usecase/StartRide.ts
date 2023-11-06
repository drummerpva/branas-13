import { RideDAO } from '../repository/RideDAO'

type Input = {
  rideId: string
}

export class StartRide {
  constructor(readonly rideDAO: RideDAO) {}

  async execute(input: Input) {
    const ride = await this.rideDAO.getById(input.rideId)
    ride.start()
    await this.rideDAO.update(ride)
  }
}
