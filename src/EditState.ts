import {HexagonGrid, HexagonTile} from "./grid";
import {Track, TrackObject} from "./track";
import {Direction} from "./Direction";
import {Color3, Scene} from "@babylonjs/core";

export type EditStateType = 'IDLE' | 'TRACK'

export interface EditState {
    readonly type: EditStateType

    enterTile(tile: HexagonTile): void

    leaveTile(tile: HexagonTile): void

    pickTile(tile: HexagonTile): void

    pickTrack(track: Track): void

    beforeStateChange(): void

    rightClick(): void
}

export class IdleEditState implements EditState {

    static INSTANCE = new IdleEditState()

    private constructor() {
    }

    get type(): EditStateType {
        return 'IDLE'
    }

    enterTile(_tile: HexagonTile) {
    }

    leaveTile(_tile: HexagonTile) {
    }

    pickTile(_tile: HexagonTile) {
    }

    pickTrack(_track: Track): void {
    }

    beforeStateChange() {
    }

    rightClick() {
    }
}

export class TrackEditState implements EditState {

    private currentTrack?: TrackObject
    private orientations: [Direction, Direction][] = [
        [Direction.EAST, Direction.WEST],
        [Direction.SOUTH_WEST, Direction.NORTH_EAST],
        [Direction.SOUTH_EAST, Direction.NORTH_WEST],
        [Direction.EAST, Direction.NORTH_WEST],
        [Direction.EAST, Direction.SOUTH_WEST],
        [Direction.WEST, Direction.NORTH_EAST],
        [Direction.WEST, Direction.SOUTH_EAST],
        [Direction.SOUTH_WEST, Direction.NORTH_WEST],
        [Direction.SOUTH_EAST, Direction.NORTH_EAST],
    ]
    private currentTile?: HexagonTile
    private currentOrientationIndex = 0

    constructor(private readonly scene: Scene, private readonly grid: HexagonGrid) {
    }

    private get currentOrientation(): [Direction, Direction] {
        return this.orientations[this.currentOrientationIndex]
    }

    get type(): EditStateType {
        return 'TRACK'
    }

    enterTile(tile: HexagonTile) {
        if (!tile.isEditable) {
            return
        }
        this.currentTile = tile
        this.currentTrack?.dispose()
        this.currentTrack = new TrackObject(
            this.currentOrientation[0],
            this.currentOrientation[1],
            this.scene,
            tile.body,
            {width: 0.11, height: 0.02, color: Color3.Blue(), alpha: 0.5}
        )
    }

    leaveTile(_tile: HexagonTile) {
        this.currentTrack?.dispose()
        this.currentTile = undefined
    }

    beforeStateChange() {
        this.currentTrack?.dispose()
    }

    pickTile(tile: HexagonTile) {
        if (tile.isEditable) {
            this.grid.placeTrack(tile.q, tile.r, this.currentOrientation[0], this.currentOrientation[1])
        }
    }

    pickTrack(track: Track) {
        if (track.isRemovable) {
            this.grid.removeTrack(track)
        }
    }

    rightClick() {
        this.currentOrientationIndex++
        if (this.currentOrientationIndex >= this.orientations.length) {
            this.currentOrientationIndex -= this.orientations.length
        }
        this.currentTrack?.dispose()
        if (this.currentTile)
            this.currentTrack = new TrackObject(
                this.currentOrientation[0],
                this.currentOrientation[1],
                this.scene,
                this.currentTile?.body!!,
                {width: 0.11, height: 0.02, color: Color3.Blue(), alpha: 0.5}
            )
    }
}
