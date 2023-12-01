import { AccountRepository } from '../repository/AccountRepository'
import { RepositoryFactory } from '../factory/RepositoryFactory'
import { TokenGenerator } from '../../domain/TokenGenerator'
type Input = {
  email: string
  password: string
  date: Date
}
type Outuput = {
  token: string
}
export class Login {
  accountRepository: AccountRepository
  constructor(repositoryFactory: RepositoryFactory) {
    this.accountRepository = repositoryFactory.createAccountRepository()
  }

  async execute(input: Input): Promise<Outuput> {
    const account = await this.accountRepository.getByEmail(input.email)
    if (!account) throw new Error('Authentication failed')
    if (!account.password.validate(input.password))
      throw new Error('Authentication failed')
    const token = TokenGenerator.generate(account, input.date)
    return {
      token,
    }
  }
}
