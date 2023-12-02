import { test, expect, beforeAll, afterAll } from 'vitest'
import { RequestRide } from '../../src/application/usecase/RequestRide'
import { GetRide } from '../../src/application/usecase/GetRide'
import { AcceptRide } from '../../src/application/usecase/AcceptRide'
import { MysqlAdpter } from '../../src/infra/databaase/MysqlAdapter'
import { StartRide } from '../../src/application/usecase/StartRide'
import { RideRepository } from '../../src/application/repository/RideRepository'
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepositoryDatabase'
import { RepositoryFactory } from '../../src/application/factory/RepositoryFactory'
import { DatabaseRepositoryFactory } from '../../src/infra/databaase/factory/DatabaseRepositoryFactory'
import { AccountGateway } from '../../src/application/gateway/AccountGateway'
import { AccountGatewayHttp } from '../../src/infra/gateway/AccountGatewayHttp'
import { AxiosAdapter } from '../../src/infra/http/AxiosAdapter'
import { HttpClient } from '../../src/infra/http/HttpClient'

let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let mysqlAdapter: MysqlAdpter
let rideRepository: RideRepository
let repositoryFactory: RepositoryFactory
let httpClient: HttpClient
let accountGateway: AccountGateway
beforeAll(() => {
  mysqlAdapter = new MysqlAdpter()
  httpClient = new AxiosAdapter()
  accountGateway = new AccountGatewayHttp(httpClient)
  rideRepository = new RideRepositoryDatabase(mysqlAdapter)
  repositoryFactory = new DatabaseRepositoryFactory(mysqlAdapter)
  requestRide = new RequestRide(repositoryFactory, accountGateway)
  getRide = new GetRide(repositoryFactory, accountGateway)
  acceptRide = new AcceptRide(repositoryFactory, accountGateway)
  startRide = new StartRide(rideRepository)
})
afterAll(async () => {
  await mysqlAdapter.close()
})

test('Deve solicitar uma corrida e receber a rideId', async () => {
  const inputSignup: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }

  const outputSignup = await accountGateway.signup(inputSignup)

  const inputRequestRide: any = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  expect(outputRequestRide.rideId).toBeDefined()
})
test('Deve solicitar e consultar uma corrida', async () => {
  const inputSignup: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }

  const outputSignup = await accountGateway.signup(inputSignup)

  const inputRequestRide: any = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('requested')
  expect(outputGetRide.passengerId).toBe(outputSignup.accountId)
  expect(outputGetRide.date).toBeDefined()
  expect(outputGetRide.fromLat).toBe(inputRequestRide.from.lat)
  expect(outputGetRide.fromLong).toBe(inputRequestRide.from.long)
  expect(outputGetRide.toLat).toBe(inputRequestRide.to.lat)
  expect(outputGetRide.toLong).toBe(inputRequestRide.to.long)
})
test('Deve solicitar e consultar uma corrida e aceitar uma corrida', async () => {
  const inputSignupPassenger: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupPassenger =
    await accountGateway.signup(inputSignupPassenger)
  const inputRequestRide: any = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputSignupDriver: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'ABC1234',
    isDriver: true,
  }
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver)
  const inputAcceptRide: any = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('accepted')
  expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId)
})
test('Caso uma corrida seja solicitada por uma conta que não seja de passageiro deve lançar erro', async () => {
  const inputSignup: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'AAA1234',
    isDriver: true,
  }

  const outputSignup = await accountGateway.signup(inputSignup)

  const inputRequestRide: any = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error('Account is not from passenger'),
  )
})
test('Caso uma corrida seja solicitada por passeigeiro e ele já tenha outra corrida em andamento lance um erro', async () => {
  const inputSignup: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }

  const outputSignup = await accountGateway.signup(inputSignup)

  const inputRequestRide: any = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  await requestRide.execute(inputRequestRide)
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error('Passenger has an active ride'),
  )
})
test('Não deve aceitar uma corrida se a account não for driver', async () => {
  const inputSignupPassenger: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupPassenger =
    await accountGateway.signup(inputSignupPassenger)
  const inputRequestRide: any = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputSignupDriver: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver)
  const inputAcceptRide: any = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(
    'Account is not from driver',
  )
})
test('Não deve aceitar uma corrida que não tem status requested', async () => {
  const inputSignupPassenger: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupPassenger =
    await accountGateway.signup(inputSignupPassenger)
  const inputRequestRide: any = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputSignupDriver: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'AAA1234',
    isDriver: true,
  }
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver)
  const inputAcceptRide: any = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(
    'Invalid status',
  )
})
test('Não deve aceitar uma corrida caso o motorista já tenha outra corrida com status "accepted" ou "in_progress" lançar erro', async () => {
  const inputSignupPassenger1: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupPassenger1 = await accountGateway.signup(
    inputSignupPassenger1,
  )
  const inputRequestRide1: any = {
    passengerId: outputSignupPassenger1.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const outputRequestRide1 = await requestRide.execute(inputRequestRide1)
  const inputSignupPassenger2: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupPassenger2 = await accountGateway.signup(
    inputSignupPassenger2,
  )
  const inputRequestRide2: any = {
    passengerId: outputSignupPassenger2.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const outputRequestRide2 = await requestRide.execute(inputRequestRide2)

  const inputSignupDriver: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'AAA1234',
    isDriver: true,
  }
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver)
  const inputAcceptRide1: any = {
    rideId: outputRequestRide1.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide1)
  const inputAcceptRide2: any = {
    rideId: outputRequestRide2.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await expect(() => acceptRide.execute(inputAcceptRide2)).rejects.toThrow(
    'Driver already has an active ride',
  )
})
test('Deve solicitar e consultar uma corrida, aceitar uma corrida e iniciar a corrida', async () => {
  const inputSignupPassenger: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupPassenger =
    await accountGateway.signup(inputSignupPassenger)
  const inputRequestRide: any = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputSignupDriver: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'ABC1234',
    isDriver: true,
  }
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver)
  const inputAcceptRide: any = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  const inputStatRide = {
    rideId: outputRequestRide.rideId,
  }
  await startRide.execute(inputStatRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('in_progress')
  expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId)
})
