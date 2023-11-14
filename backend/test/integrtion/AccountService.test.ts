import { test, expect, beforeAll, afterAll } from 'vitest'
import sinon from 'sinon'
import { AccountDAODatabase } from '../../src/infra/repository/AccountDAODatabase'
import { MailerGateway } from '../../src/infra/gateway/MailerGateway'
import { AccountDAOMemory } from '../../src/infra/repository/AccountDAOMemory'
import { Account } from '../../src/domain/Account'
import { Signup } from '../../src/application/usecase/Signup'
import { GetAccount } from '../../src/application/usecase/GetAccount'
import { Connection } from '../../src/infra/databaase/Connection'
import { MysqlAdpter } from '../../src/infra/databaase/MysqlAdapter'
import { AccountDAO } from '../../src/application/repository/AccountDAO'

let signup: Signup
let getAccount: GetAccount
let connection: Connection
let accountDAO: AccountDAO
beforeAll(() => {
  connection = new MysqlAdpter()
  accountDAO = new AccountDAODatabase(connection)
  signup = new Signup(accountDAO)
  getAccount = new GetAccount(accountDAO)
})
afterAll(async () => {
  await connection.close()
})

test('Deve criar um passageiro', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }

  const output = await signup.execute(input)
  const account = await getAccount.execute(output.accountId)
  expect(account?.accountId).toBeDefined()
  expect(account?.name).toBe(input.name)
  expect(account?.email).toBe(input.email)
  expect(account?.cpf).toBe(input.cpf)
})
test('Não deve criar um passageiro com cpf inválido', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705500',
    isPassenger: true,
  }

  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid cpf'),
  )
})
test('Não deve criar um passageiro com nome inválido', async function () {
  const input = {
    name: 'John',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }

  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid name'),
  )
})
test('Não deve criar um passageiro com email inválido', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@`,
    cpf: '95818705552',
    isPassenger: true,
  }

  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid email'),
  )
})
test('Não deve criar um passageiro com conta existente', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }

  await signup.execute(input)
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Account already exists'),
  )
})
test('Deve criar um motorista', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'AAA9999',
    isDriver: true,
  }

  const output = await signup.execute(input)
  expect(output.accountId).toBeDefined()
})
test('Não deve criar um motorista com place do carro inválida', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'AAA999',
    isDriver: true,
  }

  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid plate'),
  )
})
test('Deve criar um passageiro com Stub', async function () {
  const input: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  sinon.stub(AccountDAODatabase.prototype, 'save').resolves()
  sinon.stub(AccountDAODatabase.prototype, 'getByEmail').resolves()

  const output = await signup.execute(input)
  input.account_id = output.accountId
  sinon
    .stub(AccountDAODatabase.prototype, 'getById')
    .resolves(
      Account.create(
        input.name,
        input.email,
        input.cpf,
        input.isPassenger,
        false,
        '',
      ),
    )
  const account = await getAccount.execute(output.accountId)
  expect(account?.accountId).toBeDefined()
  expect(account?.name).toBe(input.name)
  expect(account?.email).toBe(input.email)
  expect(account?.cpf).toBe(input.cpf)
  sinon.restore()
})
test('Deve criar um passageiro com Spy', async function () {
  const sendSpy = sinon.spy(MailerGateway.prototype, 'send')
  const input: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  sinon.stub(AccountDAODatabase.prototype, 'save').resolves()
  sinon.stub(AccountDAODatabase.prototype, 'getByEmail').resolves()

  const output = await signup.execute(input)
  input.account_id = output.accountId
  sinon.stub(AccountDAODatabase.prototype, 'getById').resolves(input)
  expect(sendSpy.calledOnce).toBeTruthy()
  expect(sendSpy.calledWith(input.email, 'Verification')).toBeTruthy()
  sinon.restore()
})
test('Deve criar um passageiro com Mock', async function () {
  const input: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const mailerMock = sinon.mock(MailerGateway.prototype)
  mailerMock.expects('send').withArgs(input.email, 'Verification').once()
  const mockAccountDAO = sinon.mock(AccountDAODatabase.prototype)
  mockAccountDAO.expects('save').resolves()
  mockAccountDAO.expects('getByEmail').resolves()

  const output = await signup.execute(input)
  input.account_id = output.accountId
  mockAccountDAO.expects('getById').resolves({
    ...input,
    cpf: {
      getValue() {
        return input.cpf
      },
    },
    email: {
      getValue() {
        return input.email
      },
    },
    name: {
      getValue() {
        return input.name
      },
    },
    carPlate: {
      getValue() {
        return ''
      },
    },
  })
  await getAccount.execute(output.accountId)
  mailerMock.verify()
  sinon.restore()
})
test('Deve criar um passageiro com Fake', async function () {
  const accountDAOFake = new AccountDAOMemory()
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const signupFake = new Signup(accountDAOFake)
  const getAccountFake = new GetAccount(accountDAOFake)
  const output = await signupFake.execute(input)
  const account = await getAccountFake.execute(output.accountId)
  expect(account?.accountId).toBeDefined()
  expect(account?.name).toBe(input.name)
  expect(account?.email).toBe(input.email)
  expect(account?.cpf).toBe(input.cpf)
})
