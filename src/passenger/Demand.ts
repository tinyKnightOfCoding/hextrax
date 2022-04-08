import {City} from "../City";
import {Passenger} from "./Passenger";
import {Simulation} from '../Simulation'

export class Demand {

    private timePassed = 0

    constructor(readonly origin: City,
                readonly destination: City,
                readonly sim: Simulation,
                readonly rate: number = 1000) {
    }

    update(delta: number) {
        this.timePassed += delta
        if(this.timePassed >= this.rate) {
            this.origin.addPassenger(new Passenger(this.origin, this.destination, this.sim))
            this.timePassed -= this.rate
        }
    }
}
