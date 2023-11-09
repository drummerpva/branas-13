"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const RequestRide_1 = require("../../src/application/usecase/RequestRide");
const GetRide_1 = require("../../src/application/usecase/GetRide");
const AcceptRide_1 = require("../../src/application/usecase/AcceptRide");
const Signup_1 = require("../../src/application/usecase/Signup");
const MysqlAdapter_1 = require("../../src/infra/databaase/MysqlAdapter");
const AccountDAODatabase_1 = require("../../src/infra/repository/AccountDAODatabase");
const RideDAODatabase_1 = require("../../src/infra/repository/RideDAODatabase");
const StartRide_1 = require("../../src/application/usecase/StartRide");
let requestRide;
let getRide;
let acceptRide;
let startRide;
let signup;
let mysqlAdapter;
let accountDAO;
let rideDAO;
(0, vitest_1.beforeAll)(() => {
    mysqlAdapter = new MysqlAdapter_1.MysqlAdpter();
    rideDAO = new RideDAODatabase_1.RideDAODatabase(mysqlAdapter);
    accountDAO = new AccountDAODatabase_1.AccountDAODatabase(mysqlAdapter);
    requestRide = new RequestRide_1.RequestRide(rideDAO, accountDAO);
    getRide = new GetRide_1.GetRide(rideDAO);
    acceptRide = new AcceptRide_1.AcceptRide(rideDAO, accountDAO);
    startRide = new StartRide_1.StartRide(rideDAO);
    signup = new Signup_1.Signup(accountDAO);
});
(0, vitest_1.afterAll)(async () => {
    await mysqlAdapter.close();
});
(0, vitest_1.test)('Deve solicitar uma corrida e receber a rideId', async () => {
    const inputSignup = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
        },
    };
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    (0, vitest_1.expect)(outputRequestRide.rideId).toBeDefined();
});
(0, vitest_1.test)('Deve solicitar e consultar uma corrida', async () => {
    const inputSignup = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
        },
    };
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    (0, vitest_1.expect)(outputGetRide.getStatus()).toBe('requested');
    (0, vitest_1.expect)(outputGetRide.passengerId).toBe(outputSignup.accountId);
    (0, vitest_1.expect)(outputGetRide.date).toBeDefined();
    (0, vitest_1.expect)(outputGetRide.fromLat).toBe(inputRequestRide.from.lat);
    (0, vitest_1.expect)(outputGetRide.fromLong).toBe(inputRequestRide.from.long);
    (0, vitest_1.expect)(outputGetRide.toLat).toBe(inputRequestRide.to.lat);
    (0, vitest_1.expect)(outputGetRide.toLong).toBe(inputRequestRide.to.long);
});
(0, vitest_1.test)('Deve solicitar e consultar uma corrida e aceitar uma corrida', async () => {
    const inputSignupPassenger = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const outputSignupPassenger = await signup.execute(inputSignupPassenger);
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
        },
    };
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputSignupDriver = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        carPlate: 'ABC1234',
        isDriver: true,
    };
    const outputSignupDriver = await signup.execute(inputSignupDriver);
    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId,
    };
    await acceptRide.execute(inputAcceptRide);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    (0, vitest_1.expect)(outputGetRide.getStatus()).toBe('accepted');
    (0, vitest_1.expect)(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});
(0, vitest_1.test)('Caso uma corrida seja solicitada por uma conta que não seja de passageiro deve lançar erro', async () => {
    const inputSignup = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        carPlate: 'AAA1234',
        isDriver: true,
    };
    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
        },
    };
    await (0, vitest_1.expect)(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('Account is not from passenger'));
});
(0, vitest_1.test)('Caso uma corrida seja solicitada por passeigeiro e ele já tenha outra corrida em andamento lance um erro', async () => {
    const inputSignup = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
        },
    };
    await requestRide.execute(inputRequestRide);
    await (0, vitest_1.expect)(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('Passenger has an active ride'));
});
(0, vitest_1.test)('Não deve aceitar uma corrida se a account não for driver', async () => {
    const inputSignupPassenger = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const outputSignupPassenger = await signup.execute(inputSignupPassenger);
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
        },
    };
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputSignupDriver = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const outputSignupDriver = await signup.execute(inputSignupDriver);
    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId,
    };
    await (0, vitest_1.expect)(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow('Account is not from driver');
});
(0, vitest_1.test)('Não deve aceitar uma corrida que não tem status requested', async () => {
    const inputSignupPassenger = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const outputSignupPassenger = await signup.execute(inputSignupPassenger);
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
        },
    };
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputSignupDriver = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        carPlate: 'AAA1234',
        isDriver: true,
    };
    const outputSignupDriver = await signup.execute(inputSignupDriver);
    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId,
    };
    await acceptRide.execute(inputAcceptRide);
    await (0, vitest_1.expect)(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow('Ride is not requested');
});
(0, vitest_1.test)('Não deve aceitar uma corrida caso o motorista já tenha outra corrida com status "accepted" ou "in_progress" lançar erro', async () => {
    const inputSignupPassenger1 = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const outputSignupPassenger1 = await signup.execute(inputSignupPassenger1);
    const inputRequestRide1 = {
        passengerId: outputSignupPassenger1.accountId,
        from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
        },
    };
    const outputRequestRide1 = await requestRide.execute(inputRequestRide1);
    const inputSignupPassenger2 = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const outputSignupPassenger2 = await signup.execute(inputSignupPassenger2);
    const inputRequestRide2 = {
        passengerId: outputSignupPassenger2.accountId,
        from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
        },
    };
    const outputRequestRide2 = await requestRide.execute(inputRequestRide2);
    const inputSignupDriver = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        carPlate: 'AAA1234',
        isDriver: true,
    };
    const outputSignupDriver = await signup.execute(inputSignupDriver);
    const inputAcceptRide1 = {
        rideId: outputRequestRide1.rideId,
        driverId: outputSignupDriver.accountId,
    };
    await acceptRide.execute(inputAcceptRide1);
    const inputAcceptRide2 = {
        rideId: outputRequestRide2.rideId,
        driverId: outputSignupDriver.accountId,
    };
    await (0, vitest_1.expect)(() => acceptRide.execute(inputAcceptRide2)).rejects.toThrow('Driver already has an active ride');
});
(0, vitest_1.test)('Deve solicitar e consultar uma corrida, aceitar uma corrida e iniciar a corrida', async () => {
    const inputSignupPassenger = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
    };
    const outputSignupPassenger = await signup.execute(inputSignupPassenger);
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
        },
    };
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputSignupDriver = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        carPlate: 'ABC1234',
        isDriver: true,
    };
    const outputSignupDriver = await signup.execute(inputSignupDriver);
    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId,
    };
    await acceptRide.execute(inputAcceptRide);
    const inputStatRide = {
        rideId: outputRequestRide.rideId,
    };
    await startRide.execute(inputStatRide);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    (0, vitest_1.expect)(outputGetRide.getStatus()).toBe('in_progress');
    (0, vitest_1.expect)(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});
