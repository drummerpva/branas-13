import { GetAccount } from '../../application/usecase/GetAccount'
import { HttpServer } from '../http/HttpServer'
import { Signup } from '../../application/usecase/Signup'
import { RequestRide } from '../../application/usecase/RequestRide'
import { GetRide } from '../../application/usecase/GetRide'

export class MainController {
  constructor(
    readonly httpServer: HttpServer,
    readonly signup: Signup,
    readonly getAccount: GetAccount,
    readonly requestRide: RequestRide,
    readonly getRide: GetRide,
  ) {}

  registerEndpoints() {
    this.httpServer.on('post', '/signup', async (params: any, body: any) => {
      const output = await this.signup.execute(body)
      return output
    })
    this.httpServer.on(
      'post',
      '/request_ride',
      async (params: any, body: any) => {
        const output = await this.requestRide.execute(body)
        return output
      },
    )
    this.httpServer.on('get', '/accounts/:accountId', async (params: any) => {
      const output = await this.getAccount.execute(params.accountId)
      return output
    })
    this.httpServer.on('get', '/rides/:rideId', async (params: any) => {
      const output = await this.getRide.execute(params.rideId)
      return output
    })
  }
}
