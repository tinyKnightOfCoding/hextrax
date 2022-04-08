import {AbstractMesh, ActionManager, Mesh, Vector3} from '@babylonjs/core'
import {City} from '../City'
import {Direction} from './Direction'
import {Track} from '../track'

export interface HexagonTile {
    readonly q: number,
    readonly r: number,
    readonly body: Mesh,
    readonly name: string,
    readonly city?: City,
    readonly isEditable: boolean,

    setPosition(position: Vector3): void

    addTrack(from: Direction,
             to: Direction,
             trackActionManager: ActionManager,
             isRemovable?: boolean,
             station?: City,
    ): Track | undefined

    removeTrack(track: Track): void

    tracksByDirection(d: Direction): Track[]

    trackByMesh(mesh: AbstractMesh): Track | undefined
}
