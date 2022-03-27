import {Vector3} from "@babylonjs/core";

export interface Waypoint {
    coordinate: Vector3
    stopName?: string
}

export class RailwayLine {

    isRoundtrip: boolean = false
    private readonly _waypoints: Waypoint[] = []

    constructor(readonly name: string) {
    }

    addWaypoint(q: number, r: number, stopName?: string) {
        this._waypoints.push({coordinate: this.convert(q, r), stopName: stopName})
    }

    get waypoints(): Waypoint[] {
        const copyOfWaypoints = this._waypoints.map(v => ({coordinate: v.coordinate.clone(), stopName: v.stopName}))
        if (!this.isRoundtrip) {
            const reversed = [...copyOfWaypoints]
            reversed.reverse()
            reversed.shift()
            copyOfWaypoints.push(...reversed)
        }
        return [...copyOfWaypoints]
    }


    private convert(q: number, r: number): Vector3 {
        const z = (q + (r / 2)) * Math.sqrt(3) / 2
        const x = r * 0.75
        return new Vector3(x, 0.17, z)
    }
}
