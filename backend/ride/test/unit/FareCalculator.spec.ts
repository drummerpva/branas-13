import { FareCalculatorFactory } from '../../src/domain/FareCalculator'

test('Deve calcular o valor da tarifa em horário normal com base na distancia', () => {
  const distance = 10
  const fareCalculator = FareCalculatorFactory.create(
    new Date('2023-10-10T10:00:00'),
  )
  const fare = fareCalculator.calculate(distance)
  expect(fare).toBe(21)
})
test('Deve calcular o valor da tarifa em horário norturno com base na distancia', () => {
  const distance = 10
  const fareCalculator = FareCalculatorFactory.create(
    new Date('2023-10-10T03:10:00'),
  )
  const fare = fareCalculator.calculate(distance)
  expect(fare).toBe(50)
})
