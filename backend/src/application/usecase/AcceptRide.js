"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptRide = void 0;
class AcceptRide {
    rideDAO;
    accountDAO;
    constructor(rideDAO, accountDAO) {
        this.rideDAO = rideDAO;
        this.accountDAO = accountDAO;
    }
    async execute(input) {
        const account = await this.accountDAO.getById(input.driverId);
        if (!account?.isDriver)
            throw new Error('Account is not from driver');
        const ride = await this.rideDAO.getById(input.rideId);
        ride.accept(input.driverId);
        const activeRides = await this.rideDAO.getActiveRideByDriverId(input.driverId);
        if (activeRides.length)
            throw new Error('Driver already has an active ride');
        await this.rideDAO.update(ride);
    }
}
exports.AcceptRide = AcceptRide;
