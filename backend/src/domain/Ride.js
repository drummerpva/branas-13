"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const node_crypto_1 = require("node:crypto");
class Ride {
    rideId;
    passengerId;
    status;
    fromLat;
    fromLong;
    toLat;
    toLong;
    date;
    driverId;
    constructor(rideId, passengerId, status, fromLat, fromLong, toLat, toLong, date) {
        this.rideId = rideId;
        this.passengerId = passengerId;
        this.status = status;
        this.fromLat = fromLat;
        this.fromLong = fromLong;
        this.toLat = toLat;
        this.toLong = toLong;
        this.date = date;
    }
    static create(passengerId, fromLat, fromLong, toLat, toLong) {
        const rideId = (0, node_crypto_1.randomUUID)();
        const status = 'requested';
        const date = new Date();
        return new Ride(rideId, passengerId, status, fromLat, fromLong, toLat, toLong, date);
    }
    static restore(rideId, passengerId, driverId, status, fromLat, fromLong, toLat, toLong, date) {
        const ride = new Ride(rideId, passengerId, status, fromLat, fromLong, toLat, toLong, date);
        ride.driverId = driverId;
        return ride;
    }
    accept(driverId) {
        if (this.status !== 'requested')
            throw new Error('Ride is not requested');
        this.driverId = driverId;
        this.status = 'accepted';
    }
    start() {
        if (this.status !== 'accepted')
            throw new Error('Ride is not accepted');
        this.status = 'in_progress';
    }
    getStatus() {
        return this.status;
    }
}
exports.Ride = Ride;
