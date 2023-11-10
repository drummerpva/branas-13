import { Account } from '../../entity/Account'

export interface RideGateway {
  // signup(input: any): Promise<any>
  signup(input: Account): Promise<any>
}
