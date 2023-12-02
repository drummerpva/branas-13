import { PaymentGateway } from '../../application/gateway/PaymentGateway'
import { HttpClient } from '../http/HttpClient'

export class PaymentGatewayHttp implements PaymentGateway {
  constructor(readonly httpClient: HttpClient) {}
  process(input: any): Promise<any> {
    return this.httpClient.post('http://localhost:3002/processPayment', input)
  }
}
