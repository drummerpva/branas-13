import { MailerGateway } from '../../infra/gateway/MailerGateway'
import { Account } from '../../domain/Account'
import { AccountRepository } from '../repository/AccountRepository'
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

  constructor(readonly accountRepository: AccountRepository) {
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
    const existingAccount = await this.accountRepository.getByEmail(input.email)
    if (existingAccount) throw new Error('Account already exists')

    await this.accountRepository.save(account)
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
