import { Position } from '../../domain/Position'
import { PositionRepository } from '../repository/PositionRepository'
import { RideDAO } from '../repository/RideDAO'

type Input = {
  rideId: string
  lat: number
  long: number
}

export class UpdatePositionV2 {
  constructor(
    readonly rideDAO: RideDAO,
    readonly positionRepository: PositionRepository,
  ) {}

  async execute(input: Input) {
    const ride = await this.rideDAO.getById(input.rideId)
    if (ride.status.value !== 'in_progress') throw new Error()
    const position = Position.create(input.rideId, input.lat, input.long)
    await this.positionRepository.save(position)
  }
}
