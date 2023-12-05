import amqp from 'amqplib'
import { Queue } from './Queue'

export class RabbitMQAdapter implements Queue {
  async publish(exchange: string, input: any): Promise<void> {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(exchange, 'direct', { durable: true })
    channel.publish(exchange, '', Buffer.from(JSON.stringify(input)))
  }

  async consume(
    exchange: string,
    queue: string,
    callback: (input: any) => Promise<void>,
  ): Promise<void> {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(exchange, 'direct', { durable: true })
    await channel.assertQueue(queue, { durable: true })
    await channel.bindQueue(queue, exchange, '')
    await channel.consume(queue, async (message: any) => {
      if (message) {
        const input = JSON.parse(message.content.toString())
        await callback(input)
        channel.ack(message)
      }
    })
  }
}
