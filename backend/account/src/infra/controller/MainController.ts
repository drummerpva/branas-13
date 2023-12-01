import { HttpServer } from '../http/HttpServer'
import { inject } from '../dependency-injection/Inject'
import { Signup } from '../../application/usecase/Signup'
import { GetAccount } from '../../application/usecase/GetAccount'
import { Registry } from '../dependency-injection/Registry'

export class MainController {
  // Usando decorators(annotations) para injetar dependências
  @inject('signup')
  signup?: Signup

  @inject('getAccount')
  getAccount?: GetAccount

  @inject('httpServer')
  httpServer?: HttpServer

  // Usando Singleton para injetar dependências
  registry: Registry
  constructor() {
    this.registry = Registry.getInstance()
  }

  registerEndpoints() {
    this.httpServer?.on('post', '/signup', async (params: any, body: any) => {
      const output = await this.signup?.execute(body)
      return output
    })
    this.httpServer?.on('get', '/accounts/:accountId', async (params: any) => {
      const output = await this.getAccount?.execute(params.accountId)
      return output
    })
  }
}
