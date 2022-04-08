import {TrackObject} from '../track'
import {Direction} from '../grid'
import {HexagonGrid, HexagonTile} from '../grid'
import {Color3, Scene} from '@babylonjs/core'
import {BaseEditState} from './BaseEditState'
import {Inventory} from '../inventory'

export class TrackEditState extends BaseEditState {

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

    constructor(private readonly scene: Scene,
                private readonly grid: HexagonGrid,
                private readonly inventory: Inventory,
    ) {
        super('TRACK')
    }

    private get currentOrientation(): [Direction, Direction] {
        return this.orientations[this.currentOrientationIndex]
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
            {width: 0.11, height: 0.02, color: Color3.Blue(), alpha: 0.5},
        )
    }

    leaveTile(_tile: HexagonTile) {
        this.currentTrack?.dispose()
        this.currentTile = undefined
    }

    onDestroy() {
        this.currentTrack?.dispose()
    }

    pickTile(tile: HexagonTile) {
        if (tile.isEditable && this.inventory.useTrack()) {
            this.grid.placeTrack(tile.q, tile.r, this.currentOrientation[0], this.currentOrientation[1])
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
                {width: 0.11, height: 0.02, color: Color3.Blue(), alpha: 0.5},
            )
    }
}
