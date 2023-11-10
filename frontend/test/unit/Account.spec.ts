import { Account } from '../../src/entity/Account'

test('Deve validar a accound', () => {
  const account = new Account('', '', '', '', false, false)
  expect(account.validate().join(',')).toBe(
    'Invalid name,Invalid email,Invalid cpf',
  )
})
