import amqp from 'amqplib'
import { Queue } from './Queue'

export class RabbitMQAdapter implements Queue {
  async publish(queue: string, input: any): Promise<void> {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: true })
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(input)))
  }
}
