import { useCallback, useState, ChangeEvent } from 'react'
import { useDependency } from '../hooks/useDependency'
import { Account } from '../entity/Account'

type SignupForm = {
  name: string
  email: string
  cpf: string
  isPassenger: boolean
  carPlate: string
  isDriver: boolean
}

function SignupView() {
  const { rideGateway } = useDependency()
  const [form, setForm] = useState<SignupForm>({
    name: '',
    email: '',
    cpf: '',
    carPlate: '',
    isPassenger: false,
    isDriver: false,
  })
  const [accountId, setAccountId] = useState()
  const [error, setError] = useState<any>()
  const handleChange = useCallback(
    (name: string) =>
      ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setForm((old) => ({ ...old, [name]: value }))
      },
    [],
  )

  const signup = useCallback(async () => {
    const account = new Account(
      form.name,
      form.email,
      form.cpf,
      form.carPlate,
      form.isPassenger,
      form.isDriver,
    )
    const errors = account.validate()
    if (errors.length) {
      setError(errors.join(', '))
      return
    }
    try {
      const output = await rideGateway.signup(account)
      setAccountId(output.accountId)
    } catch (error: any) {
      setError(error.message)
    }
  }, [form, rideGateway])
  return (
    <div>
      <h1 className="signup-title">Signup</h1>
      <input
        type="text"
        className="signup-name"
        value={form.name}
        onChange={handleChange('name')}
      />
      <input
        type="text"
        className="signup-email"
        value={form.email}
        onChange={handleChange('email')}
      />
      <input
        type="text"
        className="signup-cpf"
        value={form.cpf}
        onChange={handleChange('cpf')}
      />
      <input
        type="checkbox"
        className="signup-is-passenger"
        checked={form.isPassenger}
        onChange={({ target: { checked } }) =>
          setForm((old) => ({ ...old, isPassenger: checked }))
        }
      />
      <button type="button" className="signup-submit" onClick={signup}>
        Criar passageiro
      </button>
      {!!accountId && <span className="signup-account-id">{accountId}</span>}
      {!!error && <span className="signup-error">{error}</span>}
    </div>
  )
}

export default SignupView
