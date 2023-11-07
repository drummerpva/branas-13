import axios from 'axios'
import { useCallback, useState, ChangeEvent } from 'react'

type SignupForm = {
  name: string
  email: string
  cpf: string
  isPassenger: boolean
  isDriver: boolean
}

function App() {
  const [form, setForm] = useState<SignupForm>({} as SignupForm)
  const [accountId, setAccountId] = useState()
  const [error, setError] = useState()
  const handleChange = useCallback(
    (name: string) =>
      ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setForm((old) => ({ ...old, [name]: value }))
      },
    [],
  )

  const signup = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:3000/signup', form)
      const output = response.data
      setAccountId(output.accountId)
    } catch (error: any) {
      setError(error.reponse?.data.error)
    }
  }, [form])
  console.log(error)
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
      {!!error && <span className="signup-error">{error}</span>}
      {!!accountId && <span className="signup-account-id">{accountId}</span>}
    </div>
  )
}

export default App
