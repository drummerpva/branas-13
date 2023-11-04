import { AccountDAODatabase } from './AccountDAODatabase'
import { AccountDAO } from './AccountDAO'

export class GetAccount {
  constructor(readonly accountDAO: AccountDAO = new AccountDAODatabase()) {}

  async execute(accountId: string) {
    const account = this.accountDAO.getById(accountId)
    return account
  }
}
