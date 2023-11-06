import { test, expect } from 'vitest'
import { Ride } from '../../src/domain/Ride'

test('Deve criar uma corrida', () => {
  const ride = Ride.create('', 0, 0, 0, 0)
  expect(ride.rideId).toBeDefined()
  expect(ride.getStatus()).toBe('requested')
})

test('Deve aceitar uma corrida', () => {
  const ride = Ride.create('', 0, 0, 0, 0)
  ride.accept('')
  expect(ride.getStatus()).toBe('accepted')
})
test('Deve iniciar uma corrida', () => {
  const ride = Ride.create('', 0, 0, 0, 0)
  ride.accept('')
  ride.start()
  expect(ride.getStatus()).toBe('in_progress')
})
test('Deve lançar erro se corrida não estiver aceita quando for iniciar', () => {
  const ride = Ride.create('', 0, 0, 0, 0)
  expect(() => ride.start()).toThrow(new Error('Ride is not accepted'))
})
