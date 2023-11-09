"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CpfValidator = void 0;
class CpfValidator {
    validate(cpf) {
        if (!cpf)
            return false;
        cpf = this.clean(cpf);
        if (this.isInvalidLength(cpf))
            return false;
        if (this.allDigitsTheSame(cpf)) {
            const dg1 = this.calculateDigit(cpf, 10);
            const dg2 = this.calculateDigit(cpf, 11);
            const checkDigit = this.extractDigit(cpf);
            const calculatedDigit = `${dg1}${dg2}`;
            return checkDigit === calculatedDigit;
        }
        else
            return false;
    }
    clean(cpf) {
        return cpf.replace(/\D/g, '');
    }
    isInvalidLength(cpf) {
        return cpf.length !== 11;
    }
    allDigitsTheSame(cpf) {
        return !cpf.split('').every((c) => c === cpf[0]);
    }
    calculateDigit(cpf, factor) {
        let total = 0;
        for (const digit of cpf) {
            if (factor > 1)
                total += parseInt(digit) * factor--;
        }
        const rest = total % 11;
        return rest < 2 ? 0 : 11 - rest;
    }
    extractDigit(cpf) {
        return cpf.substring(cpf.length - 2, cpf.length);
    }
}
exports.CpfValidator = CpfValidator;
