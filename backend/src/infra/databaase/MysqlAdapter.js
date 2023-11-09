"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlAdpter = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
class MysqlAdpter {
    connection;
    constructor() {
        this.connection = promise_1.default.createPool('mysql://root:root@localhost:3306/branas13');
    }
    async query(statement, data) {
        const [rows] = await this.connection?.query(statement, data);
        return rows;
    }
    async close() {
        this.connection.pool.end();
    }
}
exports.MysqlAdpter = MysqlAdpter;
