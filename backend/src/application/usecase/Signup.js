"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signup = void 0;
const CpfValidator_1 = require("../../domain/CpfValidator");
const MailerGateway_1 = require("../../infra/gateway/MailerGateway");
const Account_1 = require("../../domain/Account");
class Signup {
    accountDAO;
    cpfValidator;
    mailerGateway;
    constructor(accountDAO) {
        this.accountDAO = accountDAO;
        this.cpfValidator = new CpfValidator_1.CpfValidator();
        this.mailerGateway = new MailerGateway_1.MailerGateway();
    }
    async execute(input) {
        const account = Account_1.Account.create(input.name, input.email, input.cpf, input.isPassenger ?? false, input.isDriver ?? false, input.carPlate ?? '');
        const existingAccount = await this.accountDAO.getByEmail(input.email);
        if (existingAccount)
            throw new Error('Account already exists');
        await this.accountDAO.save(account);
        await this.mailerGateway.send(account.email, 'Verification', `Please verify your code at first login ${account.verificationCode}`);
        return {
            accountId: account.accountId,
        };
    }
}
exports.Signup = Signup;
