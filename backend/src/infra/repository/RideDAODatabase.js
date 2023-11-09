"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideDAODatabase = void 0;
const Ride_1 = require("../../domain/Ride");
class RideDAODatabase {
    connection;
    constructor(connection) {
        this.connection = connection;
    }
    async save(ride) {
        await this.connection.query('insert into ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values(?,?,?,?,?,?,?,?) ', [
            ride.rideId,
            ride.passengerId,
            ride.fromLat,
            ride.fromLong,
            ride.toLat,
            ride.toLong,
            ride.getStatus(),
            ride.date,
        ]);
    }
    async update(ride) {
        await this.connection.query(
        /* sql */
        `update ride set driver_id = ?, status = ? where ride_id = ?`, [ride.driverId, ride.getStatus(), ride.rideId]);
    }
    async getById(rideId) {
        const [rideData] = await this.connection.query('SELECT * FROM ride WHERE ride_id = ?', [rideId]);
        return Ride_1.Ride.restore(rideData.ride_id, rideData.passenger_id, rideData.driver_id, rideData.status, Number(rideData.from_lat), Number(rideData.from_long), Number(rideData.to_lat), Number(rideData.to_long), rideData.date);
    }
    async getActiveRideByPassengerId(passengerId) {
        const rides = await this.connection.query(
        /* sql */ `SELECT * FROM ride WHERE passenger_id = ? AND status IN("requested", "accepted", "in_progress")`, [passengerId]);
        return rides;
    }
    async getActiveRideByDriverId(driverId) {
        const rides = await this.connection.query(
        /* sql */ `SELECT * FROM ride WHERE driver_id = ? AND status IN("accepted", "in_progress")`, [driverId]);
        return rides;
    }
}
exports.RideDAODatabase = RideDAODatabase;
