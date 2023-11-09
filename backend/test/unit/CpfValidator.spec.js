"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const CpfValidator_1 = require("../../src/domain/CpfValidator");
vitest_1.test.each(['95818705552', '01234567890', '565.486.780-60', '147.864.110-00'])('Deve validar um cpf', function (cpf) {
    const cpfValidator = new CpfValidator_1.CpfValidator();
    (0, vitest_1.expect)(cpfValidator.validate(cpf)).toBeTruthy();
});
vitest_1.test.each(['958.187.055-00', '958.187.055'])('Não deve validar um cpf', function (cpf) {
    const cpfValidator = new CpfValidator_1.CpfValidator();
    (0, vitest_1.expect)(cpfValidator.validate(cpf)).toBeFalsy();
});
