"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRide = void 0;
class GetRide {
    rideDAO;
    constructor(rideDAO) {
        this.rideDAO = rideDAO;
    }
    async execute(rideId) {
        const ride = await this.rideDAO.getById(rideId);
        return ride;
    }
}
exports.GetRide = GetRide;
