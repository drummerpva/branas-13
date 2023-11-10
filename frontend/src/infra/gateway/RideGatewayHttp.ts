import { RideGateway } from './RideGateway'
import { HttpClient } from '../http/HttpClient'
import { Account } from '../../entity/Account'

export class RideGatewayHttp implements RideGateway {
  constructor(readonly httpClient: HttpClient) {}
  async signup(input: Account): Promise<any> {
    const output = await this.httpClient.post(
      'http://localhost:3000/signup',
      input,
    )
    return output
  }
}
