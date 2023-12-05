export interface Queue {
  publish(exchange: string, input: any): Promise<void>
  consume(
    exchange: string,
    queue: string,
    callback: (input: any) => Promise<void>,
  ): Promise<void>
}
