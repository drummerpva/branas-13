"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartRide = void 0;
class StartRide {
    rideDAO;
    constructor(rideDAO) {
        this.rideDAO = rideDAO;
    }
    async execute(input) {
        const ride = await this.rideDAO.getById(input.rideId);
        ride.start();
        await this.rideDAO.update(ride);
    }
}
exports.StartRide = StartRide;
