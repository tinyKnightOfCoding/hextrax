import {Simulation} from '../Simulation'
import {
    ActionManager,
    ExecuteCodeAction,
    KeyboardEventTypes,
    KeyboardInfo,
    PointerEventTypes,
    PointerInfo, Scene,
} from '@babylonjs/core'
import {EditState} from './EditState'
import {IdleEditState} from './IdleEditState'
import {HexagonGrid} from '../grid'
import {TrackEditState} from './TrackEditState'
import {LineEditState} from './LineEditState'
import {RailwayLine} from '../line'

export class Controls {

    private editState: EditState = IdleEditState.INSTANCE

    constructor(private readonly sim: Simulation) {

        this.sim.scene.onKeyboardObservable.add((i) => this.onKeyboardEvent(i))
        this.sim.scene.onPointerObservable.add((i) => this.onPointerEvent(i))
        this.sim.tileActionManager.registerAction(
            new ExecuteCodeAction({trigger: ActionManager.OnPointerOverTrigger}, (e) =>
                this.editState.enterTile(sim.grid.tileByName(e.meshUnderPointer?.name!!)),
            ))
        this.sim.tileActionManager.registerAction(
            new ExecuteCodeAction({trigger: ActionManager.OnPointerOutTrigger}, (e) =>
                this.editState.leaveTile(sim.grid.tileByName(e.meshUnderPointer?.name!!)),
            ))
        this.sim.tileActionManager.registerAction(
            new ExecuteCodeAction({trigger: ActionManager.OnPickTrigger}, (e) => {
                    if (e.sourceEvent.button === 0)
                        this.editState.pickTile(sim.grid.tileByName(e.meshUnderPointer?.name!!))
                },
            ))
        this.sim.trackActionManager.registerAction(
            new ExecuteCodeAction({trigger: ActionManager.OnPickTrigger}, (e) => {
                    if (e.sourceEvent.button === 0 && e.meshUnderPointer)
                        this.editState.pickTrack(sim.grid.trackByMesh(e.meshUnderPointer!!))
                },
            ))
    }

    private get scene(): Scene {
        return this.sim.scene
    }

    private get lines(): RailwayLine[] {
        return this.sim.lines
    }

    private get grid(): HexagonGrid {
        return this.sim.grid
    }


    private onKeyboardEvent(keyboardInfo: KeyboardInfo) {
        switch (keyboardInfo.type) {
            case KeyboardEventTypes.KEYUP:
                switch (keyboardInfo.event.code) {
                    case 'KeyT':
                        this.editState.onDestroy()
                        this.editState = this.editState.type === 'TRACK'
                            ? IdleEditState.INSTANCE
                            : new TrackEditState(this.scene, this.grid)
                        this.editState.onCreate()
                        break
                    case 'Digit1':
                        this.editLine(0)
                        break
                    case 'Digit2':
                        this.editLine(1)
                        break
                    case 'Digit3':
                        this.editLine(2)
                        break
                    case 'Digit4':
                        this.editLine(3)
                        break
                    case 'Digit5':
                        this.editLine(4)
                        break
                    case 'Escape':
                        this.editState.onDestroy()
                        this.editState = IdleEditState.INSTANCE
                        this.editState.onCreate()
                        break
                    default:
                        console.log(keyboardInfo.event.code)
                        this.editState.onKeyup(keyboardInfo.event.code)
                        break
                }
        }
    }

    private editLine(index: number) {
        if (index >= this.lines.length) return
        this.editState.onDestroy()
        this.editState = this.editState.type === 'LINE'
        && (this.editState as LineEditState).line.name === this.lines[index].name
            ? IdleEditState.INSTANCE
            : new LineEditState(this.scene, this.lines[index], this.sim)
        this.editState.onCreate()
    }

    private onPointerEvent(pointerInfo: PointerInfo) {
        switch (pointerInfo.type) {
            case PointerEventTypes.POINTERTAP:
                if ((pointerInfo.event as PointerEvent).button) {
                    this.editState.rightClick()
                }
                break
        }
    }
}
