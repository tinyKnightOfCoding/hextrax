import {Segment} from "./TravelGraph";
import {City} from "./City";

export class Passenger {

    private currentSegmentIndex = 0

    constructor(private readonly segments: Segment[]) {
    }

    private get currentSegment(): Segment {
        return this.segments[this.currentSegmentIndex]
    }

    wantsBoard(lineName: string, stopIndex: number): boolean {
        return this.currentSegment.stopIndex === stopIndex && this.currentSegment.lineName === lineName
    }

    wantsDeboard(city: City): boolean {
        return this.currentSegment.destination === city.name
    }

    deboard() {
        this.currentSegmentIndex++
    }

    get reachedDestination(): boolean {
        return this.currentSegmentIndex === this.segments.length
    }
}
