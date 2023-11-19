import { PositionRepository } from '../repository/PositionRepository'
import { RideRepository } from '../repository/RideRepository'

type Input = {
  rideId: string
}

export class FinishRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository,
  ) {}

  async execute(input: Input) {
    const ride = await this.rideRepository.getById(input.rideId)
    const positions = await this.positionRepository.getByRideId(input.rideId)
    ride.finish(positions)
    await this.rideRepository.update(ride)
  }
}
