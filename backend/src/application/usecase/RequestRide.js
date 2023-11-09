"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRide = void 0;
const Ride_1 = require("../../domain/Ride");
class RequestRide {
    rideDAO;
    accountDAO;
    constructor(rideDAO, accountDAO) {
        this.rideDAO = rideDAO;
        this.accountDAO = accountDAO;
    }
    async execute(input) {
        const account = await this.accountDAO.getById(input.passengerId);
        if (!account?.isPassenger)
            throw new Error('Account is not from passenger');
        const activeRides = await this.rideDAO.getActiveRideByPassengerId(input.passengerId);
        if (activeRides.length)
            throw new Error('Passenger has an active ride');
        const ride = Ride_1.Ride.create(input.passengerId, input.from.lat, input.from.long, input.to.lat, input.to.long);
        await this.rideDAO.save(ride);
        return { rideId: ride.rideId };
    }
}
exports.RequestRide = RequestRide;
