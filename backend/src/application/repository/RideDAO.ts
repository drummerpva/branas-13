import { Ride } from '../../domain/Ride'

export interface RideDAO {
  save(ride: Ride): Promise<void>
  update(ride: Ride): Promise<void>
  getById(rideId: string): Promise<Ride>
  getActiveRideByPassengerId(passengerId: string): Promise<any>
  getActiveRideByDriverId(driverId: string): Promise<any>
}
