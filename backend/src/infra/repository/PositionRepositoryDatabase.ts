import { PositionRepository } from '../../application/repository/PositionRepository'
import { Coord } from '../../domain/Coord'
import { Position } from '../../domain/Position'
import { Connection } from '../databaase/Connection'

export class PositionRepositoryDatabase implements PositionRepository {
  constructor(readonly connection: Connection) {}
  async save(position: Position): Promise<void> {
    await this.connection.query(
      /* sql */
      `INSERT IGNORE INTO \`position\` (position_id, ride_id, lat, lng, date) VALUES(?,?,?,?,?)`,
      [
        position.positionId,
        position.rideId,
        position.coord.getLat(),
        position.coord.getLong(),
        position.date,
      ],
    )
  }

  async getByRideId(rideId: string): Promise<Position[]> {
    const positions: Position[] = []
    const positionsData = await this.connection.query(
      `SELECT * FROM position WHERE ride_id = ?`,
      [rideId],
    )
    for (const positionData of positionsData) {
      positions.push(
        new Position(
          positionData.position_id,
          positionData.ride_id,
          new Coord(Number(positionData.lat), Number(positionData.lng)),
          positionData.date,
        ),
      )
    }
    return positions
  }
}
