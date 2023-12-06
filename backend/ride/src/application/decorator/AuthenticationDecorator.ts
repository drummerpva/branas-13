import { AccountGateway } from '../gateway/AccountGateway'
import { UseCase } from '../usecase/UseCase'

export class AuthenticationDecorator implements UseCase {
  constructor(
    readonly useCase: UseCase,
    readonly accountGateway: AccountGateway,
  ) {}

  async execute(input: any): Promise<any> {
    if (!input.token) throw new Error('Unauthorized')
    const account = await this.accountGateway.verifyToken(input.token)
    if (!account) throw new Error('Unauthorized')
    if (!account.isValid) throw new Error('Unauthorized')

    return this.useCase.execute(input)
  }
}
