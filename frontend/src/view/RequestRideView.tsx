import { useState, useCallback, ChangeEvent } from 'react'
import { useDependency } from '../hooks/useDependency'
import { RequestRide } from '../entity/RequestRide'

type RequestRideForm = {
  accountId: string
  fromLat: string
  fromLong: string
  toLat: string
  toLong: string
}

export const RequestRideView = () => {
  const { rideGateway } = useDependency()
  const [form, setForm] = useState<RequestRideForm>({
    accountId: '',
    fromLat: '',
    fromLong: '',
    toLat: '',
    toLong: '',
  })
  const [rideId, setRideId] = useState()
  const [error, setError] = useState<any>()
  const handleChange = useCallback(
    (name: string) =>
      ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setForm((old) => ({ ...old, [name]: value }))
      },
    [],
  )

  const signup = useCallback(async () => {
    const requestRide = new RequestRide(
      form.accountId,
      { lat: Number(form.fromLat), long: Number(form.toLat) },
      { lat: Number(form.fromLong), long: Number(form.toLong) },
    )
    try {
      const output = await rideGateway.requestRide(requestRide)
      setRideId(output.rideId)
    } catch (error: any) {
      setError(error.message)
    }
  }, [form, rideGateway])
  return (
    <div>
      <h1 className="request-title">Request Ride</h1>
      <input
        type="text"
        className="request-account-id"
        value={form.accountId}
        onChange={handleChange('accountId')}
      />
      <input
        type="text"
        className="request-from-lat"
        value={form.fromLat}
        onChange={handleChange('fromLat')}
      />
      <input
        type="text"
        className="request-from-long"
        value={form.fromLong}
        onChange={handleChange('fromLong')}
      />
      <input
        type="text"
        className="request-to-lat"
        value={form.toLat}
        onChange={handleChange('toLat')}
      />
      <input
        type="text"
        className="request-to-long"
        value={form.toLong}
        onChange={handleChange('toLong')}
      />
      <button type="button" className="request-submit" onClick={signup}>
        Solicitar corrida
      </button>
      {!!rideId && <span className="request-ride-id">{rideId}</span>}
      {!!error && <span className="signup-error">{error}</span>}
    </div>
  )
}
