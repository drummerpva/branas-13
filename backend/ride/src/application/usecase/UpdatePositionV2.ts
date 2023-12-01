import { Position } from '../../domain/Position'
import { PositionRepository } from '../repository/PositionRepository'
import { RideRepository } from '../repository/RideRepository'

type Input = {
  rideId: string
  lat: number
  long: number
}

export class UpdatePositionV2 {
  constructor(
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository,
  ) {}

  async execute(input: Input) {
    const ride = await this.rideRepository.getById(input.rideId)
    if (ride.getStatus() !== 'in_progress') throw new Error()
    const position = Position.create(input.rideId, input.lat, input.long)
    await this.positionRepository.save(position)
  }
}
