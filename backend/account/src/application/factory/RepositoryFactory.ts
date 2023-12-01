import { AccountRepository } from '../repository/AccountRepository'

export interface RepositoryFactory {
  createAccountRepository(): AccountRepository
}
