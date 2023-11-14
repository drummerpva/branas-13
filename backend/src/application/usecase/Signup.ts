import { MailerGateway } from '../../infra/gateway/MailerGateway'
import { AccountDAO } from '../repository/AccountDAO'
import { Account } from '../../domain/Account'
type Input = {
  name: string
  email: string
  cpf: string
  isPassenger?: boolean
  isDriver?: boolean
  carPlate?: string
}

export class Signup {
  mailerGateway: MailerGateway

  constructor(readonly accountDAO: AccountDAO) {
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
      account.email.getValue(),
      'Verification',
      `Please verify your code at first login ${account.verificationCode}`,
    )
    return {
      accountId: account.accountId,
    }
  }
}
