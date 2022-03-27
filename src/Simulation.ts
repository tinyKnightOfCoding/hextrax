import {ArcRotateCamera, Color3, Engine, HemisphericLight, Scene, Vector3} from "@babylonjs/core";
import {AdvancedDynamicTexture} from "@babylonjs/gui";
import {Clock} from "./Clock";
import {HexagonalGrid} from "./HexagonalGrid";
import {City} from "./City";

export class Simulation {

    private readonly engine: Engine
    private readonly scene: Scene
    private readonly clock: Clock
    private readonly grid: HexagonalGrid
    private readonly ui: AdvancedDynamicTexture

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
    }

    start() {
        this.engine.runRenderLoop(() => {
            this.clock.passTime(this.engine.getDeltaTime())
            this.scene.render()
        })
    }

    createTile(q: number, r: number) {
        this.grid.createTile(q, r)
    }

    placeCity(q: number, r: number, name: string) {
        this.grid.placeCity(q, r, new City(name, this.ui))
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
