import { HttpServer } from '../http/HttpServer'
import { inject } from '../dependency-injection/Inject'
import { RequestRide } from '../../application/usecase/RequestRide'
import { GetRide } from '../../application/usecase/GetRide'
import { Registry } from '../dependency-injection/Registry'

export class MainController {
  // Usando decorators(annotations) para injetar dependências

  @inject('requestRide')
  requestRide?: RequestRide

  @inject('getRide')
  getRide?: GetRide

  @inject('httpServer')
  httpServer?: HttpServer

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
    this.httpServer?.on('get', '/rides/:rideId', async (params: any) => {
      const output = await this.registry
        .inject('getRide')
        .execute(params.rideId)
      return output
    })
  }
}
