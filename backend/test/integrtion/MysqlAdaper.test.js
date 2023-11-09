"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const MysqlAdapter_1 = require("../../src/infra/databaase/MysqlAdapter");
(0, vitest_1.test)('Deve fazer uma query no banco de dados', async () => {
    const mysqlAdapter = new MysqlAdapter_1.MysqlAdpter();
    const rows = await mysqlAdapter.query('SELECT * FROM account limit 1', []);
    await mysqlAdapter.close();
    (0, vitest_1.expect)(rows.length).toBe(1);
});
