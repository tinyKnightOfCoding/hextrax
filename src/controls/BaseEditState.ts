import {EditState, EditStateType} from './EditState'
import {HexagonTile} from '../grid'
import {Track} from '../track'

export class BaseEditState implements EditState {

    constructor(readonly type: EditStateType) {
    }

    enterTile(_tile: HexagonTile): void {
    }

    leaveTile(_tile: HexagonTile): void {
    }

    onCreate(): void {
    }

    onDestroy(): void {
    }

    onKeyup(_code: string): void {
    }

    pickTile(_tile: HexagonTile): void {
    }

    pickTrack(_track: Track): void {
    }

    rightClick(): void {
    }


}
