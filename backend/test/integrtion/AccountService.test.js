"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const sinon_1 = __importDefault(require("sinon"));
const AccountDAODatabase_1 = require("../../src/infra/repository/AccountDAODatabase");
const MailerGateway_1 = require("../../src/infra/gateway/MailerGateway");
const AccountDAOMemory_1 = require("../../src/infra/repository/AccountDAOMemory");
const Account_1 = require("../../src/domain/Account");
const Signup_1 = require("../../src/application/usecase/Signup");
const GetAccount_1 = require("../../src/application/usecase/GetAccount");
const MysqlAdapter_1 = require("../../src/infra/databaase/MysqlAdapter");
let signup;
let getAccount;
let connection;
let accountDAO;
(0, vitest_1.beforeAll)(() => {
    connection = new MysqlAdapter_1.MysqlAdpter();
    accountDAO = new AccountDAODatabase_1.AccountDAODatabase(connection);
    signup = new Signup_1.Signup(accountDAO);
    getAccount = new GetAccount_1.GetAccount(accountDAO);
});
(0, vitest_1.afterAll)(async () => {
    await connection.close();
});
(0, vitest_1.test)('Deve criar um passageiro', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const output = await signup.execute(input);
    const account = await getAccount.execute(output.accountId);
    (0, vitest_1.expect)(account?.accountId).toBeDefined();
    (0, vitest_1.expect)(account?.name).toBe(input.name);
    (0, vitest_1.expect)(account?.email).toBe(input.email);
    (0, vitest_1.expect)(account?.cpf).toBe(input.cpf);
});
(0, vitest_1.test)('Não deve criar um passageiro com cpf inválido', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705500',
        isPassenger: true,
    };
    await (0, vitest_1.expect)(() => signup.execute(input)).rejects.toThrow(new Error('Invalid cpf'));
});
(0, vitest_1.test)('Não deve criar um passageiro com nome inválido', async function () {
    const input = {
        name: 'John',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    await (0, vitest_1.expect)(() => signup.execute(input)).rejects.toThrow(new Error('Invalid name'));
});
(0, vitest_1.test)('Não deve criar um passageiro com email inválido', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@`,
        cpf: '95818705552',
        isPassenger: true,
    };
    await (0, vitest_1.expect)(() => signup.execute(input)).rejects.toThrow(new Error('Invalid email'));
});
(0, vitest_1.test)('Não deve criar um passageiro com conta existente', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    await signup.execute(input);
    await (0, vitest_1.expect)(() => signup.execute(input)).rejects.toThrow(new Error('Account already exists'));
});
(0, vitest_1.test)('Deve criar um motorista', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        carPlate: 'AAA9999',
        isDriver: true,
    };
    const output = await signup.execute(input);
    (0, vitest_1.expect)(output.accountId).toBeDefined();
});
(0, vitest_1.test)('Não deve criar um motorista com place do carro inválida', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        carPlate: 'AAA999',
        isDriver: true,
    };
    await (0, vitest_1.expect)(() => signup.execute(input)).rejects.toThrow(new Error('Invalid plate'));
});
(0, vitest_1.test)('Deve criar um passageiro com Stub', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    sinon_1.default.stub(AccountDAODatabase_1.AccountDAODatabase.prototype, 'save').resolves();
    sinon_1.default.stub(AccountDAODatabase_1.AccountDAODatabase.prototype, 'getByEmail').resolves();
    const output = await signup.execute(input);
    input.account_id = output.accountId;
    sinon_1.default
        .stub(AccountDAODatabase_1.AccountDAODatabase.prototype, 'getById')
        .resolves(Account_1.Account.create(input.name, input.email, input.cpf, input.isPassenger, false, ''));
    const account = await getAccount.execute(output.accountId);
    (0, vitest_1.expect)(account?.accountId).toBeDefined();
    (0, vitest_1.expect)(account?.name).toBe(input.name);
    (0, vitest_1.expect)(account?.email).toBe(input.email);
    (0, vitest_1.expect)(account?.cpf).toBe(input.cpf);
    sinon_1.default.restore();
});
(0, vitest_1.test)('Deve criar um passageiro com Spy', async function () {
    const sendSpy = sinon_1.default.spy(MailerGateway_1.MailerGateway.prototype, 'send');
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    sinon_1.default.stub(AccountDAODatabase_1.AccountDAODatabase.prototype, 'save').resolves();
    sinon_1.default.stub(AccountDAODatabase_1.AccountDAODatabase.prototype, 'getByEmail').resolves();
    const output = await signup.execute(input);
    input.account_id = output.accountId;
    sinon_1.default.stub(AccountDAODatabase_1.AccountDAODatabase.prototype, 'getById').resolves(input);
    (0, vitest_1.expect)(sendSpy.calledOnce).toBeTruthy();
    (0, vitest_1.expect)(sendSpy.calledWith(input.email, 'Verification')).toBeTruthy();
    sinon_1.default.restore();
});
(0, vitest_1.test)('Deve criar um passageiro com Mock', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const mailerMock = sinon_1.default.mock(MailerGateway_1.MailerGateway.prototype);
    mailerMock.expects('send').withArgs(input.email, 'Verification').once();
    const mockAccountDAO = sinon_1.default.mock(AccountDAODatabase_1.AccountDAODatabase.prototype);
    mockAccountDAO.expects('save').resolves();
    mockAccountDAO.expects('getByEmail').resolves();
    const output = await signup.execute(input);
    input.account_id = output.accountId;
    mockAccountDAO.expects('getById').resolves(input);
    await getAccount.execute(output.accountId);
    mailerMock.verify();
    sinon_1.default.restore();
});
(0, vitest_1.test)('Deve criar um passageiro com Fake', async function () {
    const accountDAOFake = new AccountDAOMemory_1.AccountDAOMemory();
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const signupFake = new Signup_1.Signup(accountDAOFake);
    const getAccountFake = new GetAccount_1.GetAccount(accountDAOFake);
    const output = await signupFake.execute(input);
    const account = await getAccountFake.execute(output.accountId);
    (0, vitest_1.expect)(account?.accountId).toBeDefined();
    (0, vitest_1.expect)(account?.name).toBe(input.name);
    (0, vitest_1.expect)(account?.email).toBe(input.email);
    (0, vitest_1.expect)(account?.cpf).toBe(input.cpf);
});
