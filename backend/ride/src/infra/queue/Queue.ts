export interface Queue {
  publish(queue: string, input: any): Promise<void>
}
