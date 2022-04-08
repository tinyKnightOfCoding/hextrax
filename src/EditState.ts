import {HexagonGrid, HexagonTile} from "./grid";
import {Track, TrackObject} from "./track";
import {Direction} from "./Direction";
import {Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3} from "@babylonjs/core";
import {RailwayLine} from "./line";
import {Simulation} from "./Simulation";

export type EditStateType = 'IDLE' | 'TRACK' | 'LINE'

export interface EditState {
    readonly type: EditStateType

    enterTile(tile: HexagonTile): void

    leaveTile(tile: HexagonTile): void

    pickTile(tile: HexagonTile): void

    pickTrack(track: Track): void

    onDestroy(): void

    onCreate(): void

    onKeyup(code: string): void

    rightClick(): void
}

export class IdleEditState implements EditState {

    static INSTANCE = new IdleEditState()
    readonly type = 'IDLE'

    private constructor() {
    }

    enterTile(_tile: HexagonTile) {
    }

    leaveTile(_tile: HexagonTile) {
    }

    pickTile(_tile: HexagonTile) {
    }

    pickTrack(_track: Track): void {
    }

    onDestroy() {
    }

    onCreate() {
    }

    onKeyup(_code: string) {
    }

    rightClick() {
    }
}

export class LineEditState implements EditState {
    readonly type = 'LINE'
    highlight: Mesh[] = []

    constructor(private readonly scene: Scene, private readonly line: RailwayLine, private readonly sim: Simulation) {
    }

    onDestroy(): void {
        this.highlight.forEach(h => h.dispose())
    }

    onCreate() {
        console.log('edit line ', this.line.name)
        this.updateHighlight()
    }

    onKeyup(code: string) {
        switch (code) {
            case 'NumpadAdd':
                this.sim.placeTrain('T' + (String(this.sim.trainCount + 1).padStart(3, '0')), this.line)
                break
        }
    }

    private updateHighlight() {
        this.highlight.forEach(h => h.dispose())
        this.highlight = []
        if(this.line.waypoints.length < 2) return
        for (let i = 0; i < (this.line.waypoints.length / 2) - 1; i++) {
            const origin = this.line.waypoints[i].coordinate.clone()
            const destination = this.line.waypoints[i + 1].coordinate.clone()
            const mat = new StandardMaterial(this.line.name, this.scene)
            mat.diffuseColor = this.line.color
            mat.specularColor = this.line.color
            mat.alpha = 0.5
            const mesh = MeshBuilder.CreateBox("track", {width: 0.2, height: 0.03, depth: (Math.sqrt(3) / 2) - 0.15}, this.scene)
            mesh.material = mat
            console.log('creating mesh')
            mesh.position = origin
            mesh.lookAt(destination)
            mesh.translate(Vector3.Forward(), Math.sqrt(3) / 4)
            this.highlight.push(mesh)
        }
    }

    enterTile(tile: HexagonTile): void {
    }

    leaveTile(tile: HexagonTile): void {
    }

    pickTile(tile: HexagonTile): void {
    }

    pickTrack(track: Track): void {
        if (track?.station) {
            console.log('picked track ', track?.station?.name)
            this.line.addStopAt(track.station!!)
            this.updateHighlight()
        }
    }

    rightClick(): void {
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
    readonly type = 'TRACK'

    constructor(private readonly scene: Scene, private readonly grid: HexagonGrid) {
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
            {width: 0.11, height: 0.02, color: Color3.Blue(), alpha: 0.5}
        )
    }

    leaveTile(_tile: HexagonTile) {
        this.currentTrack?.dispose()
        this.currentTile = undefined
    }

    onDestroy() {
        this.currentTrack?.dispose()
    }

    onCreate() {
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

    onKeyup(_code: string) {
    }
}
