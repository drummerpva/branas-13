import { test, expect } from 'vitest'
import { AccountService } from '../src/AccountService'
import { RideService } from '../src/RideService'

test('Deve solicitar uma corrida e receber a rideId', async () => {
  const inputSignup: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const accountService = new AccountService()
  const outputSignup = await accountService.signup(inputSignup)

  const inputRequestRide: any = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const rideService = new RideService()
  const outputRequestRide = await rideService.requestRide(inputRequestRide)
  expect(outputRequestRide.rideId).toBeDefined()
})
test('Deve solicitar e consultar uma corrida', async () => {
  const inputSignup: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const accountService = new AccountService()
  const outputSignup = await accountService.signup(inputSignup)

  const inputRequestRide: any = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const rideService = new RideService()
  const outputRequestRide = await rideService.requestRide(inputRequestRide)
  const outputGetRide = await rideService.getRide(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('requested')
  expect(outputGetRide.passenger_id).toBe(outputSignup.accountId)
  expect(outputGetRide.date).toBeDefined()
  expect(+outputGetRide.from_lat).toBe(inputRequestRide.from.lat)
  expect(+outputGetRide.from_long).toBe(inputRequestRide.from.long)
  expect(+outputGetRide.to_lat).toBe(inputRequestRide.to.lat)
  expect(+outputGetRide.to_lat).toBe(inputRequestRide.to.lat)
})
test('Deve solicitar e consultar uma corrida e aceitar uma corrida', async () => {
  const accountService = new AccountService()
  const inputSignupPassenger: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupPassenger =
    await accountService.signup(inputSignupPassenger)
  const inputRequestRide: any = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const rideService = new RideService()
  const outputRequestRide = await rideService.requestRide(inputRequestRide)
  const inputSignupDriver: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'ABC1234',
    isDriver: true,
  }
  const outputSignupDriver = await accountService.signup(inputSignupDriver)
  const inputAcceptRide: any = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await rideService.acceptRide(inputAcceptRide)
  const outputGetRide = await rideService.getRide(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('accepted')
  expect(outputGetRide.driver_id).toBe(outputSignupDriver.accountId)
})
test('Caso uma corrida seja solicitada por uma conta que não seja de passageiro deve lançar erro', async () => {
  const inputSignup: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'AAA1234',
    isDriver: true,
  }
  const accountService = new AccountService()
  const outputSignup = await accountService.signup(inputSignup)

  const inputRequestRide: any = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const rideService = new RideService()
  await expect(() => rideService.requestRide(inputRequestRide)).rejects.toThrow(
    new Error('Account is not from passenger'),
  )
})
test('Caso uma corrida seja solicitada por passeigeiro e ele já tenha outra corrida em andamento lance um erro', async () => {
  const inputSignup: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const accountService = new AccountService()
  const outputSignup = await accountService.signup(inputSignup)

  const inputRequestRide: any = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const rideService = new RideService()
  await rideService.requestRide(inputRequestRide)
  await expect(() => rideService.requestRide(inputRequestRide)).rejects.toThrow(
    new Error('Passenger has an active ride'),
  )
})
test('Não deve aceitar uma corrida se a account não for driver', async () => {
  const accountService = new AccountService()
  const inputSignupPassenger: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupPassenger =
    await accountService.signup(inputSignupPassenger)
  const inputRequestRide: any = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const rideService = new RideService()
  const outputRequestRide = await rideService.requestRide(inputRequestRide)
  const inputSignupDriver: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupDriver = await accountService.signup(inputSignupDriver)
  const inputAcceptRide: any = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await expect(() => rideService.acceptRide(inputAcceptRide)).rejects.toThrow(
    'Account is not from driver',
  )
})
test('Não deve aceitar uma corrida que não tem status requested', async () => {
  const accountService = new AccountService()
  const inputSignupPassenger: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupPassenger =
    await accountService.signup(inputSignupPassenger)
  const inputRequestRide: any = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const rideService = new RideService()
  const outputRequestRide = await rideService.requestRide(inputRequestRide)
  const inputSignupDriver: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'AAA1234',
    isDriver: true,
  }
  const outputSignupDriver = await accountService.signup(inputSignupDriver)
  const inputAcceptRide: any = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await rideService.acceptRide(inputAcceptRide)
  await expect(() => rideService.acceptRide(inputAcceptRide)).rejects.toThrow(
    'Ride is not requested',
  )
})
test('Não deve aceitar uma corrida caso o motorista já tenha outra corrida com status "accepted" ou "in_progress" lançar erro', async () => {
  const accountService = new AccountService()
  const inputSignupPassenger1: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupPassenger1 = await accountService.signup(
    inputSignupPassenger1,
  )
  const inputRequestRide1: any = {
    passengerId: outputSignupPassenger1.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const rideService = new RideService()
  const outputRequestRide1 = await rideService.requestRide(inputRequestRide1)
  const inputSignupPassenger2: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupPassenger2 = await accountService.signup(
    inputSignupPassenger2,
  )
  const inputRequestRide2: any = {
    passengerId: outputSignupPassenger2.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const outputRequestRide2 = await rideService.requestRide(inputRequestRide2)

  const inputSignupDriver: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'AAA1234',
    isDriver: true,
  }
  const outputSignupDriver = await accountService.signup(inputSignupDriver)
  const inputAcceptRide1: any = {
    rideId: outputRequestRide1.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await rideService.acceptRide(inputAcceptRide1)
  const inputAcceptRide2: any = {
    rideId: outputRequestRide2.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await expect(() => rideService.acceptRide(inputAcceptRide2)).rejects.toThrow(
    'Driver already has an active ride',
  )
})
