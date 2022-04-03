import {Direction} from "../Direction";
import {AbstractMesh, Node, Scene} from "@babylonjs/core";
import {TrackObject} from "./TrackObject";
import {TrackObjectOptions} from "./TrackObjectOptions";
import {City} from "../City";

export class Track {

    private readonly object: TrackObject
    private readonly neighbours: Track[] = []

    constructor(readonly from: Direction,
                readonly to: Direction,
                scene: Scene,
                readonly parent: Node,
                readonly isRemovable: boolean,
                readonly station?: City,
                options?: Partial<TrackObjectOptions>,
    ) {
        this.object = new TrackObject(this.from, this.to, scene, parent, options)
    }

    shortestPathTo(destination: Track): Track[] {
        const paths: Track[][] = []
        const possiblePaths: Track[][] = [[this]]
        while (possiblePaths.length > 0) {
            const path = possiblePaths.shift()!!
            if(path[path.length - 1] === destination) {
                paths.push(path)
                continue
            }
            for (const neighbour of path[path.length - 1].neighbours) {
                if (path.includes(neighbour)) continue
                possiblePaths.push([...path, neighbour])
            }
        }
        if(paths.length === 0) {
            return []
        }
        let champion = paths.shift()!!
        for (const challenger of paths) {
            if(challenger.length < champion.length) {
                champion = challenger
            }
        }
        return champion
    }


    equals(from: Direction, to: Direction): boolean {
        return (this.from === from && this.to === to) || (this.from === to && this.to === from)
    }

    hasDirection(d: Direction): boolean {
        const hasDirection = this.from === d || this.to === d;
        if(this.station?.name === 'Murten') {
            console.log('Murten has track with direction, {}', d, ' => ', hasDirection)
        }
        return hasDirection
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
