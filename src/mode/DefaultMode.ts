import {Simulation} from '../Simulation'
import {Direction} from '../grid'
import {RailwayLine} from '../line'
import {Color3} from '@babylonjs/core'
import {Demand} from '../passenger'

export function defaultMode(simulation: Simulation) {
    const murten = simulation.placeCity(-4, 1, 'Murten', Direction.SOUTH_EAST, Direction.NORTH_WEST)
    simulation.placeCity(0, 0, 'Bern', Direction.NORTH_WEST, Direction.SOUTH_EAST)
    simulation.placeCity(3, -4, 'Solothurn', Direction.WEST, Direction.SOUTH_EAST)
    simulation.placeCity(3, 3, 'Thun', Direction.WEST, Direction.EAST)
    simulation.placeCity(-2, 4, 'Fribourg', Direction.NORTH_EAST, Direction.SOUTH_WEST)
    const biel = simulation.placeCity(-2, -2, 'Biel', Direction.SOUTH_WEST, Direction.NORTH_EAST)

    for (let q = -5; q < 6; q++) {
        for (let r = -5; r < 6; r++) {
            simulation.createTile(q, r)
        }
    }

    simulation.addLine(new RailwayLine('Line 1', Color3.Red(), simulation.trackGraph, simulation.travelGraph))
    simulation.addLine(new RailwayLine('Line 2', Color3.Green(), simulation.trackGraph, simulation.travelGraph))

    simulation.inventory.addTracks(15)
    simulation.inventory.addTrains(3)

    simulation.addDemand(new Demand(murten, biel, simulation, 2000))

}
