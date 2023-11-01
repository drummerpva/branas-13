import express, { Request, Response } from 'express'
import { AccountService } from './AccountService'
const app = express()
app.use(express.json())

const accountService = new AccountService()

app.post('/signup', async (req: Request, res: Response) => {
  const input = req.body
  const output = await accountService.signup(input)
  res.json(output)
})
app.get('/accounts/:accountId', async (req: Request, res: Response) => {
  const { accountId } = req.params
  const output = await accountService.getAccount(accountId)
  res.json(output)
})

app.listen(3000, () => console.log('Server is running!'))
