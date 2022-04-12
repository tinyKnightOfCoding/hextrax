import {ActionManager, ArcRotateCamera, Color3, Engine, HemisphericLight, Scene, Vector3} from '@babylonjs/core'
import {AdvancedDynamicTexture, Control, TextBlock} from '@babylonjs/gui'
import {Clock} from './Clock'
import {HexagonGrid} from './grid'
import {City} from './City'
import {Direction} from './grid'
import {Train} from './train'
import {RailwayLine} from './line'
import {Demand, TravelGraph} from './passenger'
import {Controls} from './controls'
import {TrackGraph} from './track'
import {Inventory} from './inventory'
import {ClockWatcher} from './ClockWatcher'
import {Milestone} from './milestone'

export class Simulation implements ClockWatcher {

    private readonly engine: Engine
    readonly scene: Scene
    private readonly clock: Clock
    readonly grid: HexagonGrid
    private readonly ui: AdvancedDynamicTexture
    private passengerCount = 0
    private readonly passengerCountText: TextBlock
    private readonly overflowText: TextBlock
    private readonly trains: Train[] = []
    private readonly _lines: RailwayLine[] = []
    readonly tileActionManager: ActionManager
    readonly trackActionManager: ActionManager
    readonly travelGraph: TravelGraph
    readonly inventory: Inventory
    // @ts-ignore
    private readonly controls: Controls
    private overflowIndex = 0
    private overflowCooldown = 2
    private overflowMax = 50
    private readonly cities: City[] = []
    private readonly milestones: Milestone[] = []

    constructor(element: HTMLCanvasElement) {
        this.engine = new Engine(element, true)
        window.addEventListener('resize', () => this.engine.resize())

        this.scene = new Scene(this.engine)
        this.scene.clearColor = Color3.FromHexString('#0a67a0').toColor4(1)
        this.createLighting()
        this.createCamera(element)

        this.ui = AdvancedDynamicTexture.CreateFullscreenUI('UI')
        this.ui.useInvalidateRectOptimization = false
        this.clock = new Clock(this.ui)
        this.clock.register(this)

        this.tileActionManager = new ActionManager(this.scene)
        this.trackActionManager = new ActionManager(this.scene)
        this.grid = new HexagonGrid(this.scene, this.tileActionManager, this.trackActionManager)
        this.controls = new Controls(this)
        this.scene.hoverCursor = 'default'
        this.inventory = new Inventory(this.ui)

        this.passengerCountText = new TextBlock()
        this.passengerCountText.text = `passengers transported: ${this.passengerCount} of ${this.milestones[0]?.passengerThreshold}`
        this.passengerCountText.color = 'white'
        this.passengerCountText.fontSize = '20px'
        this.passengerCountText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        this.passengerCountText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
        this.passengerCountText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
        this.passengerCountText.top = '30px'
        this.passengerCountText.left = '8px'
        this.passengerCountText.resizeToFit = true
        this.ui.addControl(this.passengerCountText)
        this.overflowText = new TextBlock()
        this.overflowText.text = `overflow: ${this.overflowIndex} / ${this.overflowMax}`
        this.overflowText.color = 'white'
        this.overflowText.fontSize = '20px'
        this.overflowText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        this.overflowText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
        this.overflowText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
        this.overflowText.top = '30px'
        this.overflowText.left = '500px'
        this.overflowText.resizeToFit = true
        this.ui.addControl(this.overflowText)
        this.travelGraph = new TravelGraph(this)
    }

    get lines(): RailwayLine[] {
        return [...this._lines]
    }

    get trackGraph(): TrackGraph {
        return this.grid.trackGraph
    }

    addLine(line: RailwayLine) {
        this._lines.push(line)
        this.travelGraph.updateNeighbours()
    }

    get trainCount() {
        return this.trains.length
    }

    start() {
        this.engine.runRenderLoop(() => this.renderLoop())
    }

    private renderLoop() {
        this.clock.passTime(this.engine.getDeltaTime(), this.engine.getFps())
        this.trains.forEach(t => t.update(this.engine.getDeltaTime()))
        this.cities.forEach(c => c.update(this.engine.getDeltaTime()))
        this.scene.render()
        if (this.overflowIndex >= this.overflowMax || this.milestones.length === 0) {
            this.engine.stopRenderLoop()
        }
        if (this.milestones[0] && this.milestones[0].passengerThreshold <= this.passengerCount) {
            const m = this.milestones.shift()!!
            m.setup(this)
        }
    }

    createTile(q: number, r: number) {
        this.grid.createTile(q, r)
    }

    placeCity(q: number, r: number, name: string, from: Direction, to: Direction): City {
        const city = new City(name, this, this.ui)
        this.grid.createCityTile(q, r, city, from, to)
        this.cities.push(city)
        return city
    }

    placeTrack(q: number, r: number, from: Direction, to: Direction) {
        this.grid.placeTrack(q, r, from, to)
        this.travelGraph.updateNeighbours()
    }

    placeTrain(name: string, line: RailwayLine) {
        this.trains.push(new Train(name, line, this, this.scene, this.ui))
    }

    addDemand(demand: Demand) {
        demand.origin.addDemand(demand)
    }

    cityByName(name: string): City {
        return this.grid.cityByName(name)
    }

    incrementPassengerCount(amount: number) {
        this.passengerCount += amount
        this.passengerCountText.text = `passengers transported: ${this.passengerCount} of ${this.milestones[0]?.passengerThreshold}`
    }

    private createLighting() {
        const light = new HemisphericLight('sun', Vector3.Up(), this.scene)
        light.intensity = 0.7
    }

    private createCamera(element: HTMLCanvasElement) {
        const camera = new ArcRotateCamera('camera', 0, Math.PI / 4, 8, Vector3.Zero(), this.scene)
        camera.lowerRadiusLimit = 3
        camera.upperRadiusLimit = 10
        camera.upperBetaLimit = Math.PI / 2 - 0.1
        camera.panningAxis = new Vector3(1, 0, 1)
        camera.attachControl(element, true)
    }

    newDay(): void {
    }

    newHour(): void {
        const overflowingCityCount = this.cities.filter(c => c.isOverflowing).length
        if (overflowingCityCount > 0) {
            this.overflowIndex += overflowingCityCount
        } else {
            this.overflowIndex -= this.overflowCooldown
            if (this.overflowIndex < 0) {
                this.overflowIndex = 0
            }
        }
        this.overflowText.text = `overflow: ${this.overflowIndex} / ${this.overflowMax}`
    }

    newWeek(): void {
    }

    addMilestone(m: Milestone) {
        this.milestones.push(m)
        this.passengerCountText.text = `passengers transported: ${this.passengerCount} of ${this.milestones[0]?.passengerThreshold}`
    }
}
