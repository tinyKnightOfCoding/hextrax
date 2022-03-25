import {Vector3} from "@babylonjs/core";

export class RailwayLine {

    isRoundtrip: boolean = false
    private readonly _waypoints: Vector3[] = []

    constructor(readonly name: string) {
    }

    addWaypoint(q: number, r: number) {
        this._waypoints.push(this.convert(q, r))
    }

    get waypoints(): Vector3[] {
        const copyOfWaypoints = this._waypoints.map(v => v.clone())
        if(!this.isRoundtrip) {
            const reversed = [...copyOfWaypoints].reverse()
            reversed.pop()
            copyOfWaypoints.pop()
            copyOfWaypoints.push(...reversed)
        }
        return copyOfWaypoints
    }

    private convert(q: number, r: number): Vector3 {
        const z = ((q) + ((r & 1) * 0.5)) * Math.sqrt(3) * 0.5
        const x = r * 0.75
        return new Vector3(x, 0.17, z)
    }
}
