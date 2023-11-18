import { AccountDAO } from '../repository/AccountDAO'
import { RideDAO } from '../repository/RideDAO'

type Output = {
  rideId: string
  passengerId: string
  driverId?: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
  date: Date
  status: string
  distance: number
  fare: number
  passenger: {
    accountId: string
    name: string
    email: string
    cpf: string
    carPlate: string
    isPassenger: boolean
    isDriver: boolean
  }
}
export class GetRide {
  constructor(
    readonly rideDAO: RideDAO,
    readonly accountDAO: AccountDAO,
  ) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideDAO.getById(rideId)
    const passenger = await this.accountDAO.getById(ride.passengerId)
    if (!ride || !passenger) throw new Error()
    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      driverId: ride.driverId,
      fromLat: ride.from.getLat(),
      fromLong: ride.from.getLong(),
      toLat: ride.to.getLat(),
      toLong: ride.to.getLong(),
      date: ride.date,
      status: ride.getStatus(),
      distance: ride.getDistance(),
      fare: ride.getFare(),
      passenger: {
        name: passenger.name.getValue(),
        email: passenger.email.getValue(),
        cpf: passenger.cpf.getValue(),
        carPlate: passenger.carPlate.getValue(),
        isPassenger: passenger.isPassenger,
        isDriver: passenger.isDriver,
        accountId: passenger.accountId,
      },
    }
  }
}
