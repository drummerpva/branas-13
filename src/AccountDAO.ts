import { Account } from './Account'

export interface AccountDAO {
  save(account: Account): Promise<void>
  getByEmail(email: string): Promise<Account | undefined>
  getById(accountId: string): Promise<Account | undefined>
}
