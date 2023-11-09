"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDAODatabase = void 0;
const Account_1 = require("../../domain/Account");
class AccountDAODatabase {
    connection;
    constructor(connection) {
        this.connection = connection;
    }
    async save(account) {
        await this.connection.query('insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, date, is_verified, verification_code) values (?,?,?,?,?,?,?,?,?,?)', [
            account.accountId,
            account.name,
            account.email,
            account.cpf,
            account.carPlate,
            !!account.isPassenger,
            !!account.isDriver,
            account.date,
            false,
            account.verificationCode,
        ]);
    }
    async getByEmail(email) {
        const [accountData] = await this.connection.query('select * from account where email = ?', [email]);
        if (!accountData)
            return;
        return Account_1.Account.restore(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.is_passenger, accountData.is_driver, accountData.car_plate, accountData.date, accountData.verification_code);
    }
    async getById(accountId) {
        const [accountData] = await this.connection.query('select * from account where account_id = ?', [accountId]);
        if (!accountData)
            return;
        return Account_1.Account.restore(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.is_passenger, accountData.is_driver, accountData.car_plate, accountData.date, accountData.verification_code);
    }
}
exports.AccountDAODatabase = AccountDAODatabase;
