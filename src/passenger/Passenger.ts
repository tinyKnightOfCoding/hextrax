import {City} from '../City'
import {Simulation} from '../Simulation'
import {Segment} from './TravelGraph'

export class Passenger {

    private state: 'TRAIN' | 'CITY' = 'CITY'
    private lastStop: City
    private currentPlan: Segment[] = []

    constructor(origin: City,
                private readonly destination: City,
                private readonly sim: Simulation,
    ) {
        this.lastStop = origin
        this.currentPlan = this.sim.travelGraph.findRoute(origin.name, destination.name)
        this.sim.travelGraph.register(this)
    }

    private get currentSegment(): Segment {
        return this.currentPlan[0]
    }

    wantsBoard(lineName: string, stopIndex: number): boolean {
        return this.currentSegment && this.currentSegment.stopIndex === stopIndex && this.currentSegment.lineName === lineName
    }

    wantsDeboard(city: City): boolean {
        return this.currentSegment.destination === city.name
    }

    board() {
        this.state = 'TRAIN'
    }

    deboard(city: City) {
        this.lastStop = city
        this.state = 'CITY'
        if (this.lastStop.name !== this.destination.name)
            this.currentPlan = this.sim.travelGraph.findRoute(this.lastStop.name, this.destination.name)
    }

    notify() {
        if (this.state === 'CITY') {
            this.currentPlan = this.sim.travelGraph.findRoute(this.lastStop.name, this.destination.name)
        }
    }

    dispose() {
        this.sim.travelGraph.unregister(this)
    }

    get reachedDestination(): boolean {
        return this.destination.name === this.lastStop.name
    }
}
