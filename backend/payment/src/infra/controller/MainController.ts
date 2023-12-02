import { inject } from '../dependency-injection/Inject'
import { ProcessPayment } from '../../application/usecase/ProcessPayment'
import { HttpServer } from '../http/HttpServer'

export class MainController {
  @inject('processPayment')
  processPayment?: ProcessPayment

  @inject('httpServer')
  httpServer?: HttpServer

  registerEndpoints() {
    this.httpServer?.on(
      'post',
      '/processPayment',
      async (params: any, body: any) => {
        const output = await this.processPayment?.execute(body)
        return output
      },
    )
  }
}
