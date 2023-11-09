"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const AccountDAODatabase_1 = require("../../src/infra/repository/AccountDAODatabase");
const Account_1 = require("../../src/domain/Account");
const MysqlAdapter_1 = require("../../src/infra/databaase/MysqlAdapter");
let accountDAO;
let connection;
(0, vitest_1.beforeAll)(() => {
    connection = new MysqlAdapter_1.MysqlAdpter();
    accountDAO = new AccountDAODatabase_1.AccountDAODatabase(connection);
});
(0, vitest_1.afterAll)(async () => {
    await connection.close();
});
(0, vitest_1.test)('Deve criar um registro na tabela account e consultar por email', async () => {
    const account = Account_1.Account.create('John Doe', `john.doe${Math.random()}@gmail.com`, '95818705552', true, false, '');
    await accountDAO.save(account);
    const savedAccount = await accountDAO.getByEmail(account.email);
    (0, vitest_1.expect)(savedAccount?.accountId).toBeDefined();
    (0, vitest_1.expect)(savedAccount?.name).toBe(account.name);
    (0, vitest_1.expect)(savedAccount?.email).toBe(account.email);
    (0, vitest_1.expect)(savedAccount?.cpf).toBe(account.cpf);
    (0, vitest_1.expect)(savedAccount?.isPassenger).toBeTruthy();
    (0, vitest_1.expect)(savedAccount?.date).toBeDefined();
    (0, vitest_1.expect)(savedAccount?.verificationCode).toBe(account.verificationCode);
});
(0, vitest_1.test)('Deve criar um registro na tabela account e consultar por account_id', async () => {
    const account = Account_1.Account.create('John Doe', `john.doe${Math.random()}@gmail.com`, '95818705552', true, false, '');
    await accountDAO.save(account);
    const savedAccount = await accountDAO.getById(account.accountId);
    (0, vitest_1.expect)(savedAccount?.accountId).toBeDefined();
    (0, vitest_1.expect)(savedAccount?.name).toBe(account.name);
    (0, vitest_1.expect)(savedAccount?.email).toBe(account.email);
    (0, vitest_1.expect)(savedAccount?.cpf).toBe(account.cpf);
    (0, vitest_1.expect)(savedAccount?.isPassenger).toBeTruthy();
    (0, vitest_1.expect)(savedAccount?.date).toBeDefined();
    (0, vitest_1.expect)(savedAccount?.verificationCode).toBe(account.verificationCode);
});
