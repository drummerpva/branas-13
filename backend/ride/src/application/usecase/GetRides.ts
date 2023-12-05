import { RepositoryFactory } from '../factory/RepositoryFactory'
import { AccountGateway } from '../gateway/AccountGateway'
import { RideRepository } from '../repository/RideRepository'

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
  driver: {
    accountId: string
    name: string
    email: string
    cpf: string
    carPlate: string
    isPassenger: boolean
    isDriver: boolean
  }
}
export class GetRides {
  private rideRepository: RideRepository
  constructor(
    repositoryFactory: RepositoryFactory,
    readonly accountGateway: AccountGateway,
  ) {
    this.rideRepository = repositoryFactory.createRideRepository()
  }

  async execute(): Promise<Output[]> {
    const rides = await this.rideRepository.list()
    const output: Output[] = []
    for (const ride of rides) {
      const passenger = await this.accountGateway.getById(ride.passengerId)
      let driver
      if (ride.driverId) {
        driver = await this.accountGateway.getById(ride.driverId)
      }

      if (!ride || !passenger) throw new Error()
      output.push({
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
          name: passenger.name,
          email: passenger.email,
          cpf: passenger.cpf,
          carPlate: passenger.carPlate,
          isPassenger: passenger.isPassenger,
          isDriver: passenger.isDriver,
          accountId: passenger.accountId,
        },
        driver: {
          name: driver?.name,
          email: driver?.email,
          cpf: driver?.cpf,
          carPlate: driver?.carPlate,
          isPassenger: driver?.isPassenger,
          isDriver: driver?.isDriver,
          accountId: driver?.accountId,
        },
      })
    }
    return output
  }
}
