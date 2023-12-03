import { RequestRide } from '../../application/usecase/RequestRide'
import { inject } from '../dependency-injection/Inject'
import { Queue } from '../queue/Queue'

export class QueueController {
  @inject('queue')
  queue?: Queue

  @inject('requestRide')
  requestRide?: RequestRide

  registerConsumers() {
    console.log('Ride queue running...')
    // command handler - execute
    this.queue?.consume('requestRide', async (input: any) => {
      await this.requestRide?.execute(input)
    })
  }
}
