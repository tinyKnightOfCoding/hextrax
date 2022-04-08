import {Simulation} from '../Simulation'
import {Direction} from '../grid'
import {RailwayLine} from '../line'
import {Color3} from '@babylonjs/core'
import {Demand} from '../passenger'
import {Milestone} from '../milestone'

export function defaultMode(simulation: Simulation) {
    const murten = simulation.placeCity(-4, 1, 'Murten', Direction.SOUTH_EAST, Direction.NORTH_WEST)
    const bern = simulation.placeCity(0, 0, 'Bern', Direction.NORTH_WEST, Direction.SOUTH_EAST)
    const solothurn = simulation.placeCity(3, -4, 'Solothurn', Direction.WEST, Direction.SOUTH_EAST)
    const thun = simulation.placeCity(3, 3, 'Thun', Direction.WEST, Direction.EAST)
    const fribourg = simulation.placeCity(-2, 4, 'Fribourg', Direction.NORTH_EAST, Direction.SOUTH_WEST)
    const biel = simulation.placeCity(-2, -2, 'Biel', Direction.SOUTH_WEST, Direction.NORTH_EAST)

    for (let q = -5; q < 6; q++) {
        for (let r = -5; r < 6; r++) {
            simulation.createTile(q, r)
        }
    }

    simulation.addLine(new RailwayLine('Line 1', Color3.Red(), simulation.trackGraph, simulation.travelGraph))
    simulation.addLine(new RailwayLine('Line 2', Color3.Green(), simulation.trackGraph, simulation.travelGraph))

    simulation.inventory.addTracks(20)
    simulation.inventory.addTrains(3)

    simulation.addDemand(new Demand(murten, solothurn, simulation, 2000))
    simulation.addDemand(new Demand(biel, bern, simulation, 2000))
    simulation.addDemand(new Demand(thun, murten, simulation, 2000))
    simulation.addDemand(new Demand(fribourg, biel, simulation, 2000))
    simulation.addDemand(new Demand(solothurn, bern, simulation, 2000))
    simulation.addDemand(new Demand(bern, thun, simulation, 2000))

    simulation.addMilestone(new Milestone(250))
}
