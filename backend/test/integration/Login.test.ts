import { RepositoryFactory } from '../../src/application/factory/RepositoryFactory'
import { Login } from '../../src/application/usecase/Login'
import { Signup } from '../../src/application/usecase/Signup'
import { Connection } from '../../src/infra/databaase/Connection'
import { MysqlAdpter } from '../../src/infra/databaase/MysqlAdapter'
import { DatabaseRepositoryFactory } from '../../src/infra/databaase/factory/DatabaseRepositoryFactory'

let signup: Signup
let login: Login
let connection: Connection
let repositoryFactory: RepositoryFactory
beforeAll(() => {
  connection = new MysqlAdpter()
  repositoryFactory = new DatabaseRepositoryFactory(connection)
  signup = new Signup(repositoryFactory)
  login = new Login(repositoryFactory)
})
afterAll(async () => {
  await connection.close()
})
test('Deve fazer um login', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }
  await signup.execute(inputSignup)
  const inputLogin = {
    email: inputSignup.email,
    password: inputSignup.password,
    date: new Date('2023-11-26T10:00:00'),
  }
  const outputLogin = await login.execute(inputLogin)
  expect(outputLogin.token).toBe(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiI5ODc2NTQzMjEwMCIsImlhdCI6MTcwMTAwMzYwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwMDB9.ebqdbU8HpWsf-M8hJMsjaUwxnQFrDj7MScnpowoE1qU',
  )
})
