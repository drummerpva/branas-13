import { test, expect, beforeAll, afterAll } from 'vitest'
import { Account } from '../../src/domain/Account'
import { Connection } from '../../src/infra/databaase/Connection'
import { MysqlAdpter } from '../../src/infra/databaase/MysqlAdapter'
import { AccountRepository } from '../../src/application/repository/AccountRepository'
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepositoryDatabase'

let accountRepository: AccountRepository
let connection: Connection
beforeAll(() => {
  connection = new MysqlAdpter()
  accountRepository = new AccountRepositoryDatabase(connection)
})
afterAll(async () => {
  await connection.close()
})

test('Deve criar um registro na tabela account e consultar por email', async () => {
  const account = Account.create(
    'John Doe',
    `john.doe${Math.random()}@gmail.com`,
    '95818705552',
    true,
    false,
    '',
  )
  await accountRepository.save(account)
  const savedAccount = await accountRepository.getByEmail(
    account.email.getValue(),
  )
  expect(savedAccount?.accountId).toBeDefined()
  expect(savedAccount?.name.getValue()).toBe(account.name.getValue())
  expect(savedAccount?.email.getValue()).toBe(account.email.getValue())
  expect(savedAccount?.cpf.getValue()).toBe(account.cpf.getValue())
  expect(savedAccount?.isPassenger).toBeTruthy()
  expect(savedAccount?.date).toBeDefined()
  expect(savedAccount?.verificationCode).toBe(account.verificationCode)
})
test('Deve criar um registro na tabela account e consultar por account_id', async () => {
  const account = Account.create(
    'John Doe',
    `john.doe${Math.random()}@gmail.com`,
    '95818705552',
    true,
    false,
    '',
  )
  await accountRepository.save(account)
  const savedAccount = await accountRepository.getById(account.accountId)
  expect(savedAccount?.accountId).toBeDefined()
  expect(savedAccount?.name.getValue()).toBe(account.name.getValue())
  expect(savedAccount?.email.getValue()).toBe(account.email.getValue())
  expect(savedAccount?.cpf.getValue()).toBe(account.cpf.getValue())
  expect(savedAccount?.isPassenger).toBeTruthy()
  expect(savedAccount?.date).toBeDefined()
  expect(savedAccount?.verificationCode).toBe(account.verificationCode)
})
