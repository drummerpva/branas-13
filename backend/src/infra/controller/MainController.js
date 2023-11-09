"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = void 0;
class MainController {
    httpServer;
    signup;
    getAccount;
    constructor(httpServer, signup, getAccount) {
        this.httpServer = httpServer;
        this.signup = signup;
        this.getAccount = getAccount;
    }
    registerEndpoints() {
        this.httpServer.on('post', '/signup', async (params, body) => {
            const output = await this.signup.execute(body);
            return output;
        });
        this.httpServer.on('get', '/accounts/:accountId', async (params) => {
            const output = await this.getAccount.execute(params.accountId);
            return output;
        });
    }
}
exports.MainController = MainController;
