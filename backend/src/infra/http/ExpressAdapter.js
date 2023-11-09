"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressAdapter = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
class ExpressAdapter {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
    }
    on(method, path, callback) {
        this.app[method](path, async (req, res) => {
            try {
                const output = await callback(req.params, req.body, req.headers);
                res.json(output);
            }
            catch (error) {
                res.status(422).json({ error: error.message });
            }
        });
    }
    listen(port) {
        this.app.listen(port, () => console.log('Express server running...'));
    }
}
exports.ExpressAdapter = ExpressAdapter;
