import {Simulation} from '../Simulation'

export class Milestone {

    constructor(
        readonly passengerThreshold: number,
        readonly setup: (sim: Simulation) => void = () => {
        },
    ) {
    }
}
