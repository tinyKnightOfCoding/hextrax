import {AbstractMesh, ActionManager, Mesh, Vector3} from '@babylonjs/core'
import {HexagonTile} from './HexagonTile'
import {Track} from '../track'
import {Direction} from './Direction'
import {City} from '../City'

export abstract class BaseTile implements HexagonTile {

    abstract body: Mesh
    readonly name: string
    abstract isEditable: boolean
    private readonly tracks: Track[] = []

    protected constructor(readonly q: number, readonly r: number) {
        this.name = `tile-${q}-${r}`
    }

    setPosition(newPosition: Vector3) {
        this.body.position = newPosition.clone()
    }

    addTrack(from: Direction,
             to: Direction,
             mngr: ActionManager,
             isRemovable: boolean = true,
             station?: City,
    ): Track | undefined {
        if (this.tracks.some(t => t.equals(from, to))) return undefined
        const newTrack = new Track(from, to, this.body._scene, this.body, isRemovable, station, {actionManager: mngr})
        this.tracks.push(newTrack)
        return newTrack
    }

    removeTrack(track: Track) {
        const indexOfTrack = this.tracks.indexOf(track)
        if (indexOfTrack === -1) {
            return undefined
        }
        return this.tracks.splice(indexOfTrack, 1)[0]
    }

    tracksByDirection(d: Direction): Track[] {
        return this.tracks.filter(t => t.hasDirection(d))
    }

    trackByMesh(mesh: AbstractMesh): Track | undefined {
        return this.tracks.find(t => t.hasMesh(mesh))
    }
}
