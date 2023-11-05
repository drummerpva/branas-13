import { CpfValidator } from './CpfValidator'
import { MailerGateway } from './MailerGateway'
import { AccountDAO } from './AccountDAO'
import { Account } from './Account'
type Input = {
  name: string
  email: string
  cpf: string
  isPassenger?: boolean
  isDriver?: boolean
  carPlate?: string
}

export class Signup {
  cpfValidator: CpfValidator
  mailerGateway: MailerGateway

  constructor(readonly accountDAO: AccountDAO) {
    this.cpfValidator = new CpfValidator()
    this.mailerGateway = new MailerGateway()
  }

  async execute(input: Input) {
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.isPassenger ?? false,
      input.isDriver ?? false,
      input.carPlate ?? '',
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
}
