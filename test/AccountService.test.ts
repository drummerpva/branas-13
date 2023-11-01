import { test, expect } from 'vitest'
import sinon from 'sinon'
import { AccountService } from '../src/AccountService'
import { AccountDAODatabase } from '../src/AccountDAODatabase'
import { MailerGateway } from '../src/MailerGateway'
import { AccountDAOMemory } from '../src/AccountDAOMemory'

test('Deve criar um passageiro', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const accountService = new AccountService()
  const output = await accountService.signup(input)
  const account = await accountService.getAccount(output.accountId)
  expect(account.account_id).toBeDefined()
  expect(account.name).toBe(input.name)
  expect(account.email).toBe(input.email)
  expect(account.cpf).toBe(input.cpf)
})
test('Não deve criar um passageiro com cpf inválido', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705500',
    isPassenger: true,
  }
  const accountService = new AccountService()
  await expect(() => accountService.signup(input)).rejects.toThrow(
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
  const accountService = new AccountService()
  await expect(() => accountService.signup(input)).rejects.toThrow(
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
  const accountService = new AccountService()
  await expect(() => accountService.signup(input)).rejects.toThrow(
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
  const accountService = new AccountService()
  await accountService.signup(input)
  await expect(() => accountService.signup(input)).rejects.toThrow(
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
  const accountService = new AccountService()
  const output = await accountService.signup(input)
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
  const accountService = new AccountService()
  await expect(() => accountService.signup(input)).rejects.toThrow(
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
  const accountService = new AccountService()
  const output = await accountService.signup(input)
  input.account_id = output.accountId
  sinon.stub(AccountDAODatabase.prototype, 'getById').resolves(input)
  const account = await accountService.getAccount(output.accountId)
  expect(account.account_id).toBeDefined()
  expect(account.name).toBe(input.name)
  expect(account.email).toBe(input.email)
  expect(account.cpf).toBe(input.cpf)
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
  const accountService = new AccountService()
  const output = await accountService.signup(input)
  input.account_id = output.accountId
  sinon.stub(AccountDAODatabase.prototype, 'getById').resolves(input)
  const account = await accountService.getAccount(output.accountId)
  expect(sendSpy.calledOnce).toBeTruthy()
  expect(
    sendSpy.calledWith(
      input.email,
      'Verification',
      `Please verify your code at first login ${account.verificationCode}`,
    ),
  ).toBeTruthy()
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
  const accountService = new AccountService()
  const output = await accountService.signup(input)
  input.account_id = output.accountId
  mockAccountDAO.expects('getById').resolves(input)
  await accountService.getAccount(output.accountId)
  mailerMock.verify()
  sinon.restore()
})
test.only('Deve criar um passageiro com Fake', async function () {
  const accountDAOFake = new AccountDAOMemory()
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const accountService = new AccountService(accountDAOFake)
  const output = await accountService.signup(input)
  const account = await accountService.getAccount(output.accountId)
  expect(account.account_id).toBeDefined()
  expect(account.name).toBe(input.name)
  expect(account.email).toBe(input.email)
  expect(account.cpf).toBe(input.cpf)
})
