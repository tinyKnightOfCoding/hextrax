import {Direction} from "../Direction";
import {AbstractMesh, Node, Scene} from "@babylonjs/core";
import {TrackObject} from "./TrackObject";
import {TrackObjectOptions} from "./TrackObjectOptions";

export class Track {

    private readonly object: TrackObject
    private readonly neighbours: Track[] = []

    constructor(readonly from: Direction,
                readonly to: Direction,
                scene: Scene,
                readonly parent: Node,
                readonly isRemovable: boolean,
                options?: Partial<TrackObjectOptions>,
    ) {
        this.object = new TrackObject(this.from, this.to, scene, parent, options)
    }

    equals(from: Direction, to: Direction): boolean {
        return (this.from === from && this.to === to) || (this.from === to && this.to === from)
    }

    hasDirection(d: Direction): boolean {
        return this.from === d || this.to === d
    }

    addNeighbour(neighbour: Track) {
        this.neighbours.push(neighbour)
    }

    removeNeighbour(neighbour: Track) {
        const index = this.neighbours.indexOf(neighbour)
        this.neighbours.splice(index, 1)
    }

    hasMesh(mesh: AbstractMesh): boolean {
        return this.object.hasMesh(mesh)
    }

    dispose() {
        this.object.dispose()
    }
}