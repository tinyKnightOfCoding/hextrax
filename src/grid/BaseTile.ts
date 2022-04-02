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

    addTrack(from: Direction, to: Direction) {
        this.tracks.push(new Track(from, to, this.body._scene, this.body))
    }
}
