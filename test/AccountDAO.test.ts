import { test, expect, beforeAll, afterAll } from 'vitest'
import { AccountDAODatabase } from '../src/AccountDAODatabase'
import { Account } from '../src/Account'
import { AccountDAO } from '../src/AccountDAO'
import { Connection } from '../src/Connection'
import { MysqlAdpter } from '../src/MysqlAdapter'

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
