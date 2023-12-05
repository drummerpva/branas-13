import { UpdateRideProjection } from '../../application/handler/UpdateRideProjection'
import { inject } from '../dependency-injection/Inject'
import { Queue } from '../queue/Queue'

export class QueueController {
  @inject('queue')
  queue?: Queue

  @inject('updateRideProjection')
  updateRideProjection?: UpdateRideProjection

  registerConsumers() {
    console.log('Ride queue running...')
    // command handler - execute
    this.queue?.consume(
      'rideFinished',
      'rideFinished.updateRideProjection',
      async (input: any) => {
        await this.updateRideProjection?.execute(input)
      },
    )
  }
}
