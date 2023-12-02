import { ProcessPayment } from '../../application/usecase/ProcessPayment'
import { inject } from '../dependency-injection/Inject'
import { Queue } from '../queue/Queue'

export class QueueController {
  @inject('processPayment')
  processPayment?: ProcessPayment

  @inject('queue')
  queue?: Queue

  registerConsumers() {
    console.log('Payment queue running...')
    this.queue?.consume('rideFinished', async (input: any) => {
      await this.processPayment?.execute(input)
    })
  }
}
