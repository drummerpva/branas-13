import { FareCalculator } from '../../src/domain/FareCalculator'

test('Deve calcular o valor da tarifa com base na distancia', () => {
  const distance = 10
  const fare = FareCalculator.calculate(distance)
  expect(fare).toBe(21)
})
