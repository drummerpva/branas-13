import { RepositoryFactory } from '../../../application/factory/RepositoryFactory'
import { AccountRepository } from '../../../application/repository/AccountRepository'
import { AccountRepositoryDatabase } from '../../repository/AccountRepositoryDatabase'
import { Connection } from '../Connection'

export class DatabaseRepositoryFactory implements RepositoryFactory {
  constructor(readonly connection: Connection) {}

  createAccountRepository(): AccountRepository {
    return new AccountRepositoryDatabase(this.connection)
  }
}
