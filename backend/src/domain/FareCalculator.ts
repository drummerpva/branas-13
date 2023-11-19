export interface FareCalculator {
  calculate(distance: number): number
}
export class FareCalculatorFactory {
  static create(date: Date) {
    if (date.getHours() >= 6 && date.getHours() <= 23)
      return new FareCalculatorNormal()
    if (date.getHours() < 6 || date.getHours() > 23)
      return new OvernightFareCalculator()
    throw new Error()
  }
}
export class FareCalculatorNormal implements FareCalculator {
  calculate(distance: number) {
    return distance * 2.1
  }
}
export class OvernightFareCalculator implements FareCalculator {
  calculate(distance: number) {
    return distance * 5
  }
}
