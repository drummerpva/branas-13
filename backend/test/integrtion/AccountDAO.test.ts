import { test, expect, beforeAll, afterAll } from 'vitest'
import { AccountDAODatabase } from '../../src/infra/repository/AccountDAODatabase'
import { Account } from '../../src/domain/Account'
import { AccountDAO } from '../../src/application/repository/AccountDAO'
import { Connection } from '../../src/infra/databaase/Connection'
import { MysqlAdpter } from '../../src/infra/databaase/MysqlAdapter'

let accountDAO: AccountDAO
let connection: Connection
beforeAll(() => {
  connection = new MysqlAdpter()
  accountDAO = new AccountDAODatabase(connection)
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
  await accountDAO.save(account)
  const savedAccount = await accountDAO.getByEmail(account.email)
  expect(savedAccount?.accountId).toBeDefined()
  expect(savedAccount?.name).toBe(account.name)
  expect(savedAccount?.email).toBe(account.email)
  expect(savedAccount?.cpf).toBe(account.cpf)
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
  await accountDAO.save(account)
  const savedAccount = await accountDAO.getById(account.accountId)
  expect(savedAccount?.accountId).toBeDefined()
  expect(savedAccount?.name).toBe(account.name)
  expect(savedAccount?.email).toBe(account.email)
  expect(savedAccount?.cpf).toBe(account.cpf)
  expect(savedAccount?.isPassenger).toBeTruthy()
  expect(savedAccount?.date).toBeDefined()
  expect(savedAccount?.verificationCode).toBe(account.verificationCode)
})
