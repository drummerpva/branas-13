"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const axios_1 = __importDefault(require("axios"));
(0, vitest_1.test)('Deve criar uma conta de passageiro', async () => {
    const inputSignup = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const responseSignup = await axios_1.default.post('http://localhost:3000/signup', inputSignup);
    const outputSignup = responseSignup.data;
    const responseGetAccount = await axios_1.default.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
    (0, vitest_1.expect)(outputGetAccount.accountId).toBeDefined();
    (0, vitest_1.expect)(outputGetAccount.name).toBe(inputSignup.name);
    (0, vitest_1.expect)(outputGetAccount.email).toBe(inputSignup.email);
    (0, vitest_1.expect)(outputGetAccount.cpf).toBe(inputSignup.cpf);
});
