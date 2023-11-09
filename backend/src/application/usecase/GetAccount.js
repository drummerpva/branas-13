"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAccount = void 0;
class GetAccount {
    accountDAO;
    constructor(accountDAO) {
        this.accountDAO = accountDAO;
    }
    async execute(accountId) {
        const account = this.accountDAO.getById(accountId);
        return account;
    }
}
exports.GetAccount = GetAccount;
