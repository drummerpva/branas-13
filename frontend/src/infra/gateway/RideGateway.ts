import { Account } from '../../entity/Account'
import { RequestRide } from '../../entity/RequestRide'

export interface RideGateway {
  // signup(input: any): Promise<any>
  signup(input: Account): Promise<any>
  requestRide(input: RequestRide): Promise<any>
}
