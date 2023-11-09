"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerGateway = void 0;
class MailerGateway {
    async send(email, subject, message) {
        console.log(email, subject, message);
    }
}
exports.MailerGateway = MailerGateway;
