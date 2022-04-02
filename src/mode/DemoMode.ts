import {Simulation} from "../Simulation";
import {Direction} from "../Direction";
import {RailwayLine} from "../RailwayLine";
import {TravelGraph} from "../TravelGraph";
import {Demand} from "../Demand";

export function demoMode(simulation: Simulation) {

    simulation.placeCity(-4, 1, "Murten", Direction.SOUTH_EAST, Direction.NORTH_WEST)
    simulation.placeCity(0, 0, "Bern", Direction.NORTH_WEST, Direction.SOUTH_EAST)
    simulation.placeCity(3, -4, "Solothurn", Direction.WEST, Direction.SOUTH_EAST)
    simulation.placeCity(3, 3, "Thun", Direction.WEST, Direction.EAST)
    simulation.placeCity(-2, 4, "Fribourg", Direction.NORTH_EAST, Direction.SOUTH_WEST)
    simulation.placeCity(-2, -2, "Biel", Direction.SOUTH_WEST, Direction.NORTH_EAST)

    for (let q = -5; q < 6; q++) {
        for (let r = -5; r < 6; r++) {
            simulation.createTile(q, r)
        }
    }

    simulation.placeTrack(-4, 0, Direction.SOUTH_EAST, Direction.NORTH_EAST)
    simulation.placeTrack(-3, -1, Direction.SOUTH_WEST, Direction.NORTH_EAST)
    simulation.placeTrack(-1, -3, Direction.SOUTH_WEST, Direction.NORTH_EAST)
    simulation.placeTrack(0, -4, Direction.SOUTH_WEST, Direction.EAST)
    simulation.placeTrack(1, -4, Direction.WEST, Direction.EAST)
    simulation.placeTrack(2, -4, Direction.WEST, Direction.EAST)
    simulation.placeTrack(3, -3, Direction.NORTH_WEST, Direction.SOUTH_WEST)
    simulation.placeTrack(2, -2, Direction.NORTH_EAST, Direction.WEST)
    simulation.placeTrack(1, -2, Direction.SOUTH_WEST, Direction.EAST)
    simulation.placeTrack(0, -1, Direction.NORTH_EAST, Direction.SOUTH_EAST)
    simulation.placeTrack(0, 1, Direction.NORTH_WEST, Direction.SOUTH_EAST)
    simulation.placeTrack(0, 2, Direction.NORTH_WEST, Direction.SOUTH_WEST)
    simulation.placeTrack(0, 2, Direction.NORTH_WEST, Direction.SOUTH_EAST)
    simulation.placeTrack(-1, 3, Direction.NORTH_EAST, Direction.SOUTH_WEST)
    simulation.placeTrack(0, 3, Direction.NORTH_WEST, Direction.EAST)
    simulation.placeTrack(1, 3, Direction.WEST, Direction.EAST)
    simulation.placeTrack(2, 3, Direction.WEST, Direction.EAST)

    const line = new RailwayLine("murten-biel-solothurn")
    line.addWaypoint(-4, 1, 'Murten')
    line.addWaypoint(-4, 0)
    line.addWaypoint(-3, -1)
    line.addWaypoint(-2, -2, 'Biel')
    line.addWaypoint(-1, -3)
    line.addWaypoint(0, -4)
    line.addWaypoint(1, -4)
    line.addWaypoint(2, -4)
    line.addWaypoint(3, -4, 'Solothurn')


    const line2 = new RailwayLine("solothurn-bern-thun")
    line2.addWaypoint(3, -4, 'Solothurn')
    line2.addWaypoint(3, -3)
    line2.addWaypoint(2, -2)
    line2.addWaypoint(1, -2)
    line2.addWaypoint(0, -1)
    line2.addWaypoint(0, 0, 'Bern')
    line2.addWaypoint(0, 1)
    line2.addWaypoint(0, 2)
    line2.addWaypoint(0, 3)
    line2.addWaypoint(1, 3)
    line2.addWaypoint(2, 3)
    line2.addWaypoint(3, 3, 'Thun')

    const line3 = new RailwayLine("fribourg-bern")
    line3.addWaypoint(-2, 4, 'Fribourg')
    line3.addWaypoint(-1, 3)
    line3.addWaypoint(0, 2)
    line3.addWaypoint(0, 1)
    line3.addWaypoint(0, 0, 'Bern')

    simulation.placeTrain("IC1", line)
    simulation.placeTrain("RE", line2)
    simulation.placeTrain("S1", line3)

    const travelGraph = new TravelGraph(line, line2, line3)
    simulation.addDemand(new Demand(simulation.cityByName("Murten"), travelGraph.findRoute("Murten", "Thun"), 1500))
    simulation.addDemand(new Demand(simulation.cityByName("Fribourg"), travelGraph.findRoute("Fribourg", "Thun"), 2000))
    simulation.addDemand(new Demand(simulation.cityByName("Bern"), travelGraph.findRoute("Bern", "Biel"), 1000))
}
