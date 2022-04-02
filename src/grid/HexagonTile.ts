import {Mesh, Vector3} from "@babylonjs/core";
import {City} from "../City";
import {Direction} from "../Direction";
import {Track} from "../track";

export interface HexagonTile {
    readonly body: Mesh,
    readonly name: string,
    readonly city?: City,

    setPosition(position: Vector3): void

    addTrack(from: Direction, to: Direction): Track | undefined

    removeTrack(from: Direction, to: Direction): Track | undefined

    tracksByDirection(d: Direction): Track[]
}
