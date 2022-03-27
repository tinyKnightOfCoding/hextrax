import {ArcRotateCamera, Color3, Engine, HemisphericLight, Scene, Vector3} from "@babylonjs/core";
import {AdvancedDynamicTexture, Control, TextBlock} from "@babylonjs/gui";
import {Clock} from "./Clock";
import {HexagonalGrid} from "./HexagonalGrid";
import {City} from "./City";
import {Direction} from "./Direction";
import {Train} from "./Train";
import {RailwayLine} from "./RailwayLine";
import {Demand} from "./Demand";

export class Simulation {

    private readonly engine: Engine
    private readonly scene: Scene
    private readonly clock: Clock
    private readonly grid: HexagonalGrid
    private readonly ui: AdvancedDynamicTexture
    private passengerCount = 0
    private readonly passengerCountText: TextBlock
    private readonly trains: Train[] = []
    private readonly demands: Demand[] = []

    constructor(element: HTMLCanvasElement) {
        this.engine = new Engine(element, true)
        window.addEventListener("resize", () => this.engine.resize())

        this.scene = new Scene(this.engine)
        this.scene.clearColor = Color3.FromHexString("#0a67a0").toColor4(1)
        this.createLighting()
        this.createCamera(element)

        this.ui = AdvancedDynamicTexture.CreateFullscreenUI("UI")
        this.ui.useInvalidateRectOptimization = false
        this.clock = new Clock(this.ui)
        this.grid = new HexagonalGrid(this.scene)

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

    placeCity(q: number, r: number, name: string) {
        this.grid.placeCity(q, r, new City(name, this, this.ui))
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

    cityAt(q: number, r: number): City {
        return this.grid.cityAt(q, r)
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
