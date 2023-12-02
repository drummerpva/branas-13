export interface Queue {
  publish(queue: string, input: any): Promise<void>
  consume(queue: string, callback: (input: any) => Promise<void>): Promise<void>
}
