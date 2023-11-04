import { CpfValidator } from './CpfValidator'
import { AccountDAODatabase } from './AccountDAODatabase'
import { MailerGateway } from './MailerGateway'
import { AccountDAO } from './AccountDAO'
import { Account } from './Account'

export class AccountService {
  cpfValidator: CpfValidator
  mailerGateway: MailerGateway

  constructor(readonly accountDAO: AccountDAO = new AccountDAODatabase()) {
    this.cpfValidator = new CpfValidator()
    this.mailerGateway = new MailerGateway()
  }

  async signup(input: any) {
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.isPassenger,
      input.isDriver,
      input.carPlate,
    )
    const existingAccount = await this.accountDAO.getByEmail(input.email)
    if (existingAccount) throw new Error('Account already exists')

    await this.accountDAO.save(account)
    await this.mailerGateway.send(
      account.email,
      'Verification',
      `Please verify your code at first login ${account.verificationCode}`,
    )
    return {
      accountId: account.accountId,
    }
  }

  async getAccount(accountId: string) {
    const account = this.accountDAO.getById(accountId)
    return account
  }
}
