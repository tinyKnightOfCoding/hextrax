import './style.css'
import {Simulation} from "./Simulation";

new Simulation(document.querySelector<HTMLCanvasElement>('#app')!!).start()

// const grid = new HexagonalGrid("base-grid", 0.99, scene)
// for (let q = -3; q < 4; q++) {
//
//     for (let r = -3; r < 4; r++) {
//         if(q === 0 && r === 0) {
//             grid.createTile(q, r, new City("Bern", advancedTexture))
//         } else if(q === 1 && r === 2) {
//             grid.createTile(q, r, new City("Thun", advancedTexture))
//         } else {
//             grid.createTile(q, r)
//         }
//     }
// }
//
// grid.addTrack(0, 0, Direction.SOUTH_WEST, Direction.EAST)
// grid.addTrack(1, 0, Direction.WEST, Direction.SOUTH_EAST)
// grid.addTrack(1, 1, Direction.NORTH_WEST, Direction.SOUTH_WEST)
// grid.addTrack(1, 2, Direction.NORTH_EAST, Direction.WEST)
// grid.addTrack(0, 2, Direction.EAST, Direction.NORTH_WEST)
// grid.addTrack(-1, 1, Direction.SOUTH_EAST, Direction.NORTH_EAST)
//
// const line = new RailwayLine("green")
// line.addWaypoint(0, 0)
// line.addWaypoint(1, 0)
// line.addWaypoint(1, 1)
// line.addWaypoint(1, 2)
// line.addWaypoint(0, 2)
// line.addWaypoint(-1, 1)
// line.isRoundtrip = true
//
// grid.addTrack(-1, 2, Direction.SOUTH_EAST, Direction.NORTH_WEST)
// grid.addTrack(-2, 1, Direction.SOUTH_EAST, Direction.NORTH_EAST)
// grid.addTrack(-1, 0, Direction.SOUTH_WEST, Direction.NORTH_WEST)
// grid.addTrack(-2, -1, Direction.SOUTH_EAST, Direction.NORTH_WEST)
// const line2 = new RailwayLine("red")
// line2.addWaypoint(-1, 2)
// line2.addWaypoint(-2, 1)
// line2.addWaypoint(-1, 0)
// line2.addWaypoint(-2, -1)
//
// const train = new Train("IC61", line, scene, advancedTexture)
//
// const train2 = new Train("S1", line2, scene, advancedTexture)

