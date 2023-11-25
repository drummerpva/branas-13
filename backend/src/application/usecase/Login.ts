import { AccountRepository } from '../repository/AccountRepository'
import { RepositoryFactory } from '../factory/RepositoryFactory'
type Input = {
  email: string
  password: string
}

export class Login {
  accountRepository: AccountRepository
  constructor(repositoryFactory: RepositoryFactory) {
    this.accountRepository = repositoryFactory.createAccountRepository()
  }

  async execute(input: Input) {
    const account = await this.accountRepository.getByEmail(input.email)
    if (!account) throw new Error('Authentication failed')
    if (!account.password.validate(input.password))
      throw new Error('Authentication failed')
    const token = '123'
    return {
      token,
    }
  }
}
