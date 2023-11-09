"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Ride_1 = require("../../src/domain/Ride");
(0, vitest_1.test)('Deve criar uma corrida', () => {
    const ride = Ride_1.Ride.create('', 0, 0, 0, 0);
    (0, vitest_1.expect)(ride.rideId).toBeDefined();
    (0, vitest_1.expect)(ride.getStatus()).toBe('requested');
});
(0, vitest_1.test)('Deve aceitar uma corrida', () => {
    const ride = Ride_1.Ride.create('', 0, 0, 0, 0);
    ride.accept('');
    (0, vitest_1.expect)(ride.getStatus()).toBe('accepted');
});
(0, vitest_1.test)('Deve iniciar uma corrida', () => {
    const ride = Ride_1.Ride.create('', 0, 0, 0, 0);
    ride.accept('');
    ride.start();
    (0, vitest_1.expect)(ride.getStatus()).toBe('in_progress');
});
(0, vitest_1.test)('Deve lançar erro se corrida não estiver aceita quando for iniciar', () => {
    const ride = Ride_1.Ride.create('', 0, 0, 0, 0);
    (0, vitest_1.expect)(() => ride.start()).toThrow(new Error('Ride is not accepted'));
});
