import { Queue } from '../../infra/queue/Queue'

export class ProcessPayment {
  constructor(readonly queue: Queue) {}
  async execute(input: any): Promise<void> {
    console.log('Process payment', input)
    await this.queue.publish('paymentApproved', { paymentId: '123123123' })
  }
}
