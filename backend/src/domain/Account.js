"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const crypto_1 = require("crypto");
const CpfValidator_1 = require("./CpfValidator");
class Account {
    accountId;
    name;
    email;
    cpf;
    isPassenger;
    isDriver;
    carPlate;
    date;
    verificationCode;
    constructor(accountId, name, email, cpf, isPassenger, isDriver, carPlate, date, verificationCode) {
        this.accountId = accountId;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.isPassenger = isPassenger;
        this.isDriver = isDriver;
        this.carPlate = carPlate;
        this.date = date;
        this.verificationCode = verificationCode;
    }
    static create(name, email, cpf, isPassenger, isDriver, carPlate) {
        if (!name.match(/[a-zA-Z] [a-zA-Z]+/))
            throw new Error('Invalid name');
        if (!email.match(/^(.+)@(.+)$/))
            throw new Error('Invalid email');
        const cpfValidator = new CpfValidator_1.CpfValidator();
        if (!cpfValidator.validate(cpf))
            throw new Error('Invalid cpf');
        if (isDriver && !carPlate.match(/[A-Z]{3}[0-9]{4}/))
            throw new Error('Invalid plate');
        const accountId = (0, crypto_1.randomUUID)();
        const verificationCode = (0, crypto_1.randomUUID)();
        const date = new Date();
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate, date, verificationCode);
    }
    static restore(accountId, name, email, cpf, isPassenger, isDriver, carPlate, date, verificationCode) {
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate, date, verificationCode);
    }
}
exports.Account = Account;
