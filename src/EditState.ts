import {HexagonTile} from "./grid";
import {Track} from "./track";
import {Direction} from "./Direction";
import {Color3, Scene} from "@babylonjs/core";

export type EditStateType = 'IDLE' | 'TRACK'

export interface EditState {
    readonly type: EditStateType

    enterTile(tile: HexagonTile): void

    leaveTile(tile: HexagonTile): void

    pickTile(tile: HexagonTile): void

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

    enterTile(tile: HexagonTile) {
    }

    leaveTile(tile: HexagonTile) {
    }

    pickTile(tile: HexagonTile) {
    }

    beforeStateChange() {
    }

    rightClick() {
    }
}

export class TrackEditState implements EditState {

    private currentTrack?: Track
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

    constructor(private readonly scene: Scene) {
    }

    private get currentOrientation(): [Direction, Direction] {
        return this.orientations[this.currentOrientationIndex]
    }

    get type(): EditStateType {
        return 'TRACK'
    }

    enterTile(tile: HexagonTile) {
        this.currentTile = tile
        this.currentTrack = new Track(
            this.currentOrientation[0],
            this.currentOrientation[1],
            this.scene,
            tile.body,
            {width: 0.11, height: 0.02, color: Color3.Blue(), alpha: 0.5}
        )
    }

    leaveTile(tile: HexagonTile) {
        this.currentTrack?.dispose()
        this.currentTile = undefined
    }

    beforeStateChange() {
        this.currentTrack?.dispose()
    }

    pickTile(tile: HexagonTile) {
        tile.addTrack(this.currentOrientation[0], this.currentOrientation[1])
    }

    rightClick() {
        this.currentOrientationIndex++
        if (this.currentOrientationIndex >= this.orientations.length) {
            this.currentOrientationIndex -= this.orientations.length
        }
        this.currentTrack?.dispose()
        if (this.currentTile)
            this.currentTrack = new Track(
                this.currentOrientation[0],
                this.currentOrientation[1],
                this.scene,
                this.currentTile?.body!!,
                {width: 0.11, height: 0.02, color: Color3.Blue(), alpha: 0.5}
            )
    }
}
