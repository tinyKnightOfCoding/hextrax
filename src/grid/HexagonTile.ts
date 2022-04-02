import {Mesh, Vector3} from "@babylonjs/core";
import {City} from "../City";
import {Direction} from "../Direction";

export interface HexagonTile {
    readonly body: Mesh,
    readonly name: string,
    readonly city?: City,

    setPosition(position: Vector3): void

    addTrack(from: Direction, to: Direction): void
}
