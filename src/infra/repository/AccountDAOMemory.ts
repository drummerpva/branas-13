import { AccountDAO } from '../../application/repository/AccountDAO'

export class AccountDAOMemory implements AccountDAO {
  accounts: any[]

  constructor() {
    this.accounts = []
  }

  async save(account: any): Promise<void> {
    this.accounts.push(account)
  }

  async getByEmail(email: string): Promise<any> {
    const account = this.accounts.find((account) => account.email === email)
    if (!account) return
    return {
      ...account,
      account_id: account.accountId,
    }
  }

  async getById(accountId: string): Promise<any> {
    const account = this.accounts.find(
      (account) => account.accountId === accountId,
    )
    if (!account) return
    return {
      ...account,
      account_id: account.accountId,
    }
  }
}
