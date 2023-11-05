import express, { Request, Response } from 'express'
import { Signup } from './Signup'
import { GetAccount } from './GetAccount'
import { MysqlAdpter } from './MysqlAdapter'
import { AccountDAODatabase } from './AccountDAODatabase'
const app = express()
app.use(express.json())

const connection = new MysqlAdpter()
const acountDAO = new AccountDAODatabase(connection)

app.post('/signup', async (req: Request, res: Response) => {
  const input = req.body
  const signup = new Signup(acountDAO)
  const output = await signup.execute(input)
  res.json(output)
})
app.get('/accounts/:accountId', async (req: Request, res: Response) => {
  const { accountId } = req.params
  const getAccount = new GetAccount(acountDAO)
  const output = await getAccount.execute(accountId)
  res.json(output)
})

app.listen(3000, () => console.log('Server is running!'))
