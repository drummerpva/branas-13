import { RideGateway } from './RideGateway'
import { HttpClient } from '../http/HttpClient'

export class RideGatewayHttp implements RideGateway {
  constructor(readonly httpClient: HttpClient) {}
  async signup(input: any): Promise<any> {
    const output = await this.httpClient.post(
      'http://localhost:3000/signup',
      input,
    )
    return output
  }
}
