import { HttpServer } from '../http/HttpServer'
import { inject } from '../dependency-injection/Inject'
import { Signup } from '../../application/usecase/Signup'
import { RequestRide } from '../../application/usecase/RequestRide'
import { GetAccount } from '../../application/usecase/GetAccount'
import { GetRide } from '../../application/usecase/GetRide'
import { Registry } from '../dependency-injection/Registry'

export class MainController {
  @inject('signup') // Não funciona
  signup?: Signup

  @inject('requestRide')
  requestRide?: RequestRide

  @inject('getAccount')
  getAccount?: GetAccount

  @inject('getRide')
  getRide?: GetRide

  registry: Registry
  constructor(readonly httpServer: HttpServer) {
    this.registry = Registry.getInstance()
    // injectDependencies(this)
  }

  registerEndpoints() {
    this.httpServer.on('post', '/signup', async (params: any, body: any) => {
      const output = await this.signup?.execute(body)
      return output
    })
    this.httpServer.on(
      'post',
      '/request_ride',
      async (params: any, body: any) => {
        const output = await this.requestRide?.execute(body)
        return output
      },
    )
    this.httpServer.on('get', '/accounts/:accountId', async (params: any) => {
      const output = await this.getAccount?.execute(params.accountId)
      return output
    })
    this.httpServer.on('get', '/rides/:rideId', async (params: any) => {
      const output = await this.getRide?.execute(params.rideId)
      return output
    })
  }
}
