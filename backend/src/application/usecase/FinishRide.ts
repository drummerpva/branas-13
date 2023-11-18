import { PositionRepository } from '../repository/PositionRepository'
import { RideDAO } from '../repository/RideDAO'

type Input = {
  rideId: string
}

export class FinishRide {
  constructor(
    readonly rideDAO: RideDAO,
    readonly positionRepository: PositionRepository,
  ) {}

  async execute(input: Input) {
    const ride = await this.rideDAO.getById(input.rideId)
    const positions = await this.positionRepository.getByRideId(input.rideId)
    ride.finish(positions)
    await this.rideDAO.update(ride)
  }
}
