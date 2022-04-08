import {City} from "../City";
import {Passenger} from "./Passenger";
import {Segment} from "./TravelGraph";

export class Demand {

    private timePassed = 0

    constructor(readonly city: City,
                readonly path: Segment[],
                readonly rate: number = 1000) {
    }

    update(delta: number) {
        this.timePassed += delta
        if(this.timePassed >= this.rate) {
            this.city.addPassenger(new Passenger(this.path))
            this.timePassed -= this.rate
        }
    }
}
