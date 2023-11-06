import { GetAccount } from './GetAccount'
import { HttpServer } from './HttpServer'
import { Signup } from './Signup'

export class MainController {
  constructor(
    readonly httpServer: HttpServer,
    readonly signup: Signup,
    readonly getAccount: GetAccount,
  ) {}

  registerEndpoints() {
    this.httpServer.on('post', '/signup', async (params: any, body: any) => {
      const output = await this.signup.execute(body)
      return output
    })
    this.httpServer.on('get', '/accounts/:accountId', async (params: any) => {
      const output = await this.getAccount.execute(params.accountId)
      return output
    })
  }
}
