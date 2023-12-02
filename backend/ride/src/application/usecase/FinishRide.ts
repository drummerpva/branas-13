import { PaymentGatewayHttp } from '../../infra/gateway/PaymentGatewayHttp'
import { AxiosAdapter } from '../../infra/http/AxiosAdapter'
import { Queue } from '../../infra/queue/Queue'
import { RabbitMQAdapter } from '../../infra/queue/RabbitMQAdapter'
import { RepositoryFactory } from '../factory/RepositoryFactory'
import { PaymentGateway } from '../gateway/PaymentGateway'
import { PositionRepository } from '../repository/PositionRepository'
import { RideRepository } from '../repository/RideRepository'

type Input = {
  rideId: string
}

export class FinishRide {
  private rideRepository: RideRepository
  private positionRepository: PositionRepository
  constructor(
    repositoryFactory: RepositoryFactory,
    readonly paymentGateway: PaymentGateway = new PaymentGatewayHttp(
      new AxiosAdapter(),
    ),
    readonly queue: Queue = new RabbitMQAdapter(),
  ) {
    this.rideRepository = repositoryFactory.createRideRepository()
    this.positionRepository = repositoryFactory.createPositionRepository()
  }

  async execute(input: Input) {
    const ride = await this.rideRepository.getById(input.rideId)
    const positions = await this.positionRepository.getByRideId(input.rideId)
    ride.finish(positions)
    // Síncrono
    /* await this.paymentGateway.process({
      rideId: ride.rideId,
      fate: ride.getFare(),
    }) */
    await this.rideRepository.update(ride)
    // Assíncrono
    await this.queue.publish('rideFinished', {
      rideId: ride.rideId,
      fare: ride.getFare(),
    })
  }
}
