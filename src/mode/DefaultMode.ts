import {Simulation} from "../Simulation";

export function defaultMode(simulation: Simulation) {
    for (let q = -5; q < 6; q++) {
        for (let r = -5; r < 6; r++) {
            simulation.createTile(q, r)
        }
    }

    simulation.placeCity(-4, 1, "Murten")
    simulation.placeCity(0, 0, "Bern")
    simulation.placeCity(3, -4, "Solothurn")
    simulation.placeCity(3, 3, "Thun")
    simulation.placeCity(-2, 4, "Fribourg")
    simulation.placeCity(-2, -2, "Biel")
}
