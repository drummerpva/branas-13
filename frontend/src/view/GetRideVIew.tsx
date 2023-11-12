import { useState, useCallback } from 'react'
import { useDependency } from '../hooks/useDependency'

export const GetRideView = () => {
  const { rideGateway } = useDependency()
  const [ride, setRide] = useState<any>(undefined)
  const [rideId, setRideId] = useState('')
  const [error, setError] = useState<any>()

  const submit = useCallback(async () => {
    try {
      const output = await rideGateway.getRide(rideId)
      setRide(output)
    } catch (error: any) {
      setError(error.message)
    }
  }, [rideGateway, rideId])
  return (
    <div>
      <h1 className="signup-title">Get Ride</h1>
      <input
        type="text"
        className="get-ride-ride-id"
        value={rideId}
        onChange={({ target: { value } }) => setRideId(value)}
      />
      <button type="button" className="get-ride-submit" onClick={submit}>
        Ver corrida
      </button>
      {!!ride?.status && (
        <div>
          <span className="get-ride-passenger-id">{ride.passengerId}</span>
          <br />
          <span className="get-ride-passenger-name">{ride.passenger.name}</span>
          <br />
          <span className="get-ride-passenger-email">
            {ride.passenger.email}
          </span>
          <br />
          <span className="get-ride-passenger-cpf">{ride.passenger.cpf}</span>
          <br />
          <span className="get-ride-status">{ride.status}</span>
        </div>
      )}
      {!!error && <span className="get-ride-error">{error}</span>}
    </div>
  )
}
