import {
    ActionManager,
    ArcRotateCamera,
    Color3,
    Engine,
    ExecuteCodeAction,
    HemisphericLight,
    KeyboardEventTypes,
    KeyboardInfo,
    PointerEventTypes,
    PointerInfo,
    Scene,
    Vector3
} from "@babylonjs/core";
import {AdvancedDynamicTexture, Control, TextBlock} from "@babylonjs/gui";
import {Clock} from "./Clock";
import {HexagonGrid} from "./grid";
import {City} from "./City";
import {Direction} from "./Direction";
import {Train} from "./Train";
import {RailwayLine} from "./RailwayLine";
import {Demand} from "./Demand";
import {EditState, IdleEditState, TrackEditState} from "./EditState";

export class Simulation {

    private readonly engine: Engine
    private readonly scene: Scene
    private readonly clock: Clock
    private readonly grid: HexagonGrid
    private readonly ui: AdvancedDynamicTexture
    private passengerCount = 0
    private readonly passengerCountText: TextBlock
    private readonly trains: Train[] = []
    private readonly demands: Demand[] = []
    private readonly tileActionManager: ActionManager
    private readonly trackActionManager: ActionManager
    private editState: EditState = IdleEditState.INSTANCE

    constructor(element: HTMLCanvasElement) {
        this.engine = new Engine(element, true)
        window.addEventListener("resize", () => this.engine.resize())

        this.scene = new Scene(this.engine)
        this.scene.clearColor = Color3.FromHexString("#0a67a0").toColor4(1)
        this.scene.onKeyboardObservable.add((i) => this.onKeyboardEvent(i))
        this.scene.onPointerObservable.add((i) => this.onPointerEvent(i))
        this.tileActionManager = new ActionManager(this.scene)
        this.trackActionManager = new ActionManager(this.scene)
        this.createLighting()
        this.createCamera(element)

        this.ui = AdvancedDynamicTexture.CreateFullscreenUI("UI")
        this.ui.useInvalidateRectOptimization = false
        this.clock = new Clock(this.ui)
        this.grid = new HexagonGrid(this.scene, this.tileActionManager, this.trackActionManager)
        this.scene.hoverCursor = 'default'
        this.tileActionManager.registerAction(
            new ExecuteCodeAction({trigger: ActionManager.OnPointerOverTrigger}, (e) =>
                this.editState.enterTile(this.grid.tileByName(e.meshUnderPointer?.name!!))
            ))
        this.tileActionManager.registerAction(
            new ExecuteCodeAction({trigger: ActionManager.OnPointerOutTrigger}, (e) =>
                this.editState.leaveTile(this.grid.tileByName(e.meshUnderPointer?.name!!))
            ))
        this.tileActionManager.registerAction(
            new ExecuteCodeAction({trigger: ActionManager.OnPickTrigger}, (e) => {
                    if (e.sourceEvent.button === 0)
                        this.editState.pickTile(this.grid.tileByName(e.meshUnderPointer?.name!!))
                }
            ))
        this.trackActionManager.registerAction(
            new ExecuteCodeAction({trigger: ActionManager.OnPickTrigger}, (e) => {
                    if (e.sourceEvent.button === 0 && e.meshUnderPointer)
                        this.editState.pickTrack(this.grid.trackByMesh(e.meshUnderPointer!!))
                }
            ))

        this.passengerCountText = new TextBlock()
        this.passengerCountText.text = `passengers transported: ${this.passengerCount}`
        this.passengerCountText.color = "white"
        this.passengerCountText.fontSize = "20px"
        this.passengerCountText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        this.passengerCountText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
        this.passengerCountText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
        this.passengerCountText.top = "30px"
        this.passengerCountText.left = "8px"
        this.passengerCountText.resizeToFit = true
        this.ui.addControl(this.passengerCountText)
    }

    private onKeyboardEvent(keyboardInfo: KeyboardInfo) {
        switch (keyboardInfo.type) {
            case KeyboardEventTypes.KEYUP:
                switch (keyboardInfo.event.code) {
                    case "KeyT":
                        this.editState.beforeStateChange()
                        this.editState = this.editState.type === 'TRACK'
                            ? IdleEditState.INSTANCE
                            : new TrackEditState(this.scene, this.grid)
                }
        }
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

    start() {
        this.engine.runRenderLoop(() => {
            this.clock.passTime(this.engine.getDeltaTime())
            this.trains.forEach(t => t.update(this.engine.getDeltaTime()))
            this.demands.forEach(d => d.update(this.engine.getDeltaTime()))
            this.scene.render()
        })
    }

    createTile(q: number, r: number) {
        this.grid.createTile(q, r)
    }

    placeCity(q: number, r: number, name: string, from: Direction, to: Direction) {
        this.grid.createCityTile(q, r, new City(name, this, this.ui), from, to)
    }

    placeTrack(q: number, r: number, from: Direction, to: Direction) {
        this.grid.placeTrack(q, r, from, to)
    }

    placeTrain(name: string, line: RailwayLine) {
        this.trains.push(new Train(name, line, this, this.scene, this.ui))
    }

    addDemand(demand: Demand) {
        this.demands.push(demand)
    }

    cityByName(name: string): City {
        return this.grid.cityByName(name)
    }

    incrementPassengerCount(amount: number) {
        this.passengerCount += amount
        this.passengerCountText.text = `passengers transported: ${this.passengerCount}`
    }

    private createLighting() {
        const light = new HemisphericLight("sun", Vector3.Up(), this.scene)
        light.intensity = 0.7
    }

    private createCamera(element: HTMLCanvasElement) {
        const camera = new ArcRotateCamera("camera", 0, Math.PI / 4, 8, Vector3.Zero(), this.scene)
        camera.lowerRadiusLimit = 3
        camera.upperRadiusLimit = 10
        camera.upperBetaLimit = Math.PI / 2 - 0.1
        camera.panningAxis = new Vector3(1, 0, 1)
        camera.attachControl(element, true)
    }
}
