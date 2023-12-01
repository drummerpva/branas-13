import { RideRepository } from '../repository/RideRepository'

type Input = {
  rideId: string
}

export class StartRide {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(input: Input) {
    const ride = await this.rideRepository.getById(input.rideId)
    ride.start()
    await this.rideRepository.update(ride)
  }
}
