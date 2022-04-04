import {Direction} from "../Direction";
import {AbstractMesh, Mesh, Scene, Vector3} from "@babylonjs/core";
import {TrackObject} from "./TrackObject";
import {TrackObjectOptions} from "./TrackObjectOptions";
import {City} from "../City";

export class Track {

    private readonly object: TrackObject
    private readonly toNeighbours: Track[] = []
    private readonly fromNeighbours: Track[] = []


    constructor(readonly from: Direction,
                readonly to: Direction,
                scene: Scene,
                readonly parent: Mesh,
                readonly isRemovable: boolean,
                readonly station?: City,
                options?: Partial<TrackObjectOptions>,
    ) {
        this.object = new TrackObject(this.from, this.to, scene, parent, options)
    }

    get position(): Vector3 {
        const pos = this.parent.position.clone();
        pos.y = 0.17
        return pos
    }

    shortestPathTo(destination: Track): Track[] {
        const paths: Track[][] = []
        const possiblePaths: { path: Track[], dir: Direction }[] = [
            {path: [this], dir: this.from},
            {path: [this], dir: this.to},
        ]
        while (possiblePaths.length > 0) {
            const path = possiblePaths.shift()!!
            if (path.path[path.path.length - 1] === destination) {
                paths.push(path.path)
                continue
            }
            const lastTrack = path.path[path.path.length - 1]
            const neighbours = lastTrack.from === path.dir ? lastTrack.fromNeighbours : lastTrack.toNeighbours
            for (const neighbour of neighbours) {
                if (path.path.includes(neighbour)) continue
                possiblePaths.push({
                    path: [...(path.path), neighbour],
                    dir: neighbour.from === path.dir.opposite ? neighbour.to : neighbour.from
                })
            }
        }
        if (paths.length === 0) {
            return []
        }
        let champion = paths.shift()!!
        for (const challenger of paths) {
            if (challenger.length < champion.length) {
                champion = challenger
            }
        }
        return champion
    }


    equals(from: Direction, to: Direction): boolean {
        return (this.from === from && this.to === to) || (this.from === to && this.to === from)
    }

    hasDirection(d: Direction): boolean {
        return this.from === d || this.to === d
    }

    addNeighbour(neighbour: Track, direction: Direction) {
        if (direction === this.to)
            this.toNeighbours.push(neighbour)
        if (direction === this.from)
            this.fromNeighbours.push(neighbour)
    }

    removeNeighbour(neighbour: Track) {
        let index = this.toNeighbours.indexOf(neighbour)
        if (index >= 0)
            this.toNeighbours.splice(index, 1)
        index = this.fromNeighbours.indexOf(neighbour)
        if (index >= 0)
            this.fromNeighbours.splice(index, 1)
    }

    hasMesh(mesh: AbstractMesh): boolean {
        return this.object.hasMesh(mesh)
    }

    dispose() {
        this.object.dispose()
    }
}
