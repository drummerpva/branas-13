import { AccountRepository } from '../repository/AccountRepository'

type Output = {
  accountId: string
  name: string
  email: string
  cpf: string
  carPlate: string
  isPassenger: boolean
  isDriver: boolean
}
export class GetAccount {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountRepository.getById(accountId)
    if (!account) throw new Error('Account not found')
    return {
      name: account.name.getValue(),
      email: account.email.getValue(),
      cpf: account.cpf.getValue(),
      carPlate: account.carPlate.getValue(),
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
      accountId: account.accountId,
    }
  }
}
