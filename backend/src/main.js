"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Signup_1 = require("./application/usecase/Signup");
const GetAccount_1 = require("./application/usecase/GetAccount");
const MysqlAdapter_1 = require("./infra/databaase/MysqlAdapter");
const ExpressAdapter_1 = require("./infra/http/ExpressAdapter");
const MainController_1 = require("./infra/controller/MainController");
const AccountDAODatabase_1 = require("./infra/repository/AccountDAODatabase");
const connection = new MysqlAdapter_1.MysqlAdpter();
const acountDAO = new AccountDAODatabase_1.AccountDAODatabase(connection);
const signup = new Signup_1.Signup(acountDAO);
const getAccount = new GetAccount_1.GetAccount(acountDAO);
const httpServer = new ExpressAdapter_1.ExpressAdapter();
const httpController = new MainController_1.MainController(httpServer, signup, getAccount);
httpController.registerEndpoints();
httpServer.listen(3000);
