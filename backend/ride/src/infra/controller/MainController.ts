import { HttpServer } from '../http/HttpServer'
import { inject } from '../dependency-injection/Inject'
import { RequestRide } from '../../application/usecase/RequestRide'
import { GetRide } from '../../application/usecase/GetRide'
import { Registry } from '../dependency-injection/Registry'
import { Queue } from '../queue/Queue'

export class MainController {
  // Usando decorators(annotations) para injetar dependências

  @inject('requestRide')
  requestRide?: RequestRide

  @inject('getRide')
  getRide?: GetRide

  @inject('httpServer')
  httpServer?: HttpServer

  @inject('queue')
  queue?: Queue

  // Usando Singleton para injetar dependências
  registry: Registry
  constructor() {
    this.registry = Registry.getInstance()
  }

  registerEndpoints() {
    this.httpServer?.on(
      'post',
      '/request_ride',
      async (params: any, body: any) => {
        const output = await this.requestRide?.execute(body)
        return output
      },
    )
    // command handler - command
    this.httpServer?.on(
      'post',
      '/request_ride_async',
      async (params: any, body: any) => {
        await this.queue?.publish('requestRide', body)
      },
    )
    this.httpServer?.on('get', '/rides/:rideId', async (params: any) => {
      const output = await this.registry
        .inject('getRide')
        .execute(params.rideId)
      return output
    })
  }
}
