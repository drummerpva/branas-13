import { test, expect, beforeAll, afterAll } from 'vitest'
import { RequestRide } from '../../src/application/usecase/RequestRide'
import { MysqlAdpter } from '../../src/infra/databaase/MysqlAdapter'
import { RepositoryFactory } from '../../src/application/factory/RepositoryFactory'
import { DatabaseRepositoryFactory } from '../../src/infra/databaase/factory/DatabaseRepositoryFactory'
import { AccountGateway } from '../../src/application/gateway/AccountGateway'
import { AccountGatewayHttp } from '../../src/infra/gateway/AccountGatewayHttp'
import { AxiosAdapter } from '../../src/infra/http/AxiosAdapter'
import { HttpClient } from '../../src/infra/http/HttpClient'
import { UseCase } from '../../src/application/usecase/UseCase'
import { AuthenticationDecorator } from '../../src/application/decorator/AuthenticationDecorator'

let requestRide: UseCase
let mysqlAdapter: MysqlAdpter
let repositoryFactory: RepositoryFactory
let httpClient: HttpClient
let accountGateway: AccountGateway
beforeAll(() => {
  mysqlAdapter = new MysqlAdpter()
  httpClient = new AxiosAdapter()
  accountGateway = new AccountGatewayHttp(httpClient)
  repositoryFactory = new DatabaseRepositoryFactory(mysqlAdapter)
  requestRide = new AuthenticationDecorator(
    new RequestRide(repositoryFactory, accountGateway),
    accountGateway,
  )
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
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiI5ODc2NTQzMjEwMCIsImlhdCI6MTcwMTAwMzYwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwMDB9.ebqdbU8HpWsf-M8hJMsjaUwxnQFrDj7MScnpowoE1qU'
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
    token,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  expect(outputRequestRide.rideId).toBeDefined()
})
