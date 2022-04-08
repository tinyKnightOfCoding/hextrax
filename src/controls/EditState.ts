import {HexagonTile} from '../grid'
import {Track} from '../track'

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

