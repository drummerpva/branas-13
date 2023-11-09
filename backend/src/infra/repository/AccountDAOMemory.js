"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDAOMemory = void 0;
class AccountDAOMemory {
    accounts;
    constructor() {
        this.accounts = [];
    }
    async save(account) {
        this.accounts.push(account);
    }
    async getByEmail(email) {
        const account = this.accounts.find((account) => account.email === email);
        if (!account)
            return;
        return {
            ...account,
            account_id: account.accountId,
        };
    }
    async getById(accountId) {
        const account = this.accounts.find((account) => account.accountId === accountId);
        if (!account)
            return;
        return {
            ...account,
            account_id: account.accountId,
        };
    }
}
exports.AccountDAOMemory = AccountDAOMemory;
