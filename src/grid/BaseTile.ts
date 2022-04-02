import {Mesh, Vector3} from "@babylonjs/core";
import {HexagonTile} from "./HexagonTile";
import {Track} from "../track";
import {Direction} from "../Direction";

export abstract class BaseTile implements HexagonTile {

    abstract body: Mesh
    abstract name: string
    private readonly tracks: Track[] = []

    setPosition(newPosition: Vector3) {
        this.body.position = newPosition.clone()
    }

    addTrack(from: Direction, to: Direction): Track | undefined {
        if (this.tracks.some(t => t.equals(from, to))) return undefined
        const newTrack = new Track(from, to, this.body._scene, this.body);
        this.tracks.push(newTrack)
        return newTrack
    }

    removeTrack(from: Direction, to: Direction): Track | undefined {
        const indexOfTrack = this.tracks.findIndex(t => t.equals(from, to))
        if (indexOfTrack === -1) {
            return undefined
        }
        return this.tracks.splice(indexOfTrack)[0]
    }

    tracksByDirection(d: Direction): Track[] {
        return this.tracks.filter(t => t.hasDirection(d))
    }
}
