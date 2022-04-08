import {Track, TrackGraph} from '../track'
import {City} from '../City'
import {Color3, Vector3} from '@babylonjs/core'
import {TravelGraph} from '../passenger'

export interface Waypoint {
    coordinate: Vector3
    stopName?: string
}

export class RailwayLine {

    readonly oneWayRoute: City[] = []

    constructor(readonly name: string,
                readonly color: Color3,
                private readonly trackGraph: TrackGraph,
                private readonly travelGraph: TravelGraph,
    ) {
    }

    addStopAt(city: City) {
        if (this.oneWayRoute.includes(city)) return
        if (this.oneWayRoute.length > 0 && this.trackGraph.path(this.oneWayRoute[this.oneWayRoute.length - 1], city).length === 0) return
        this.oneWayRoute.push(city)
        this.travelGraph.updateNeighbours()
    }

    // TODO legacy
    get waypoints(): Waypoint[] {
        const tracks: Track[] = []
        for (let idx = 0; idx < this.oneWayRoute.length - 1; idx++) {
            const origin = this.oneWayRoute[idx]
            const destination = this.oneWayRoute[idx + 1]
            tracks.push(...this.trackGraph.path(origin, destination))
            if (idx < this.oneWayRoute.length - 2) {
                tracks.pop()
            }
        }
        const reversed = [...tracks]
        reversed.reverse()
        reversed.shift()
        return [...tracks, ...reversed].map(t => ({coordinate: t.position, stopName: t.station?.name}))
    }
}
