import './style.css'
import {ArcRotateCamera, Color3, Engine, HemisphericLight, Scene, Vector3} from "@babylonjs/core";
import {HexagonalGrid} from "./HexagonalGrid";
import {Direction} from "./Direction";
import {RailwayLine} from "./RailwayLine";
import {Train} from "./Train";
import {City} from "./City";
import {AdvancedDynamicTexture} from "@babylonjs/gui";

const app = document.querySelector<HTMLCanvasElement>('#app')!

const engine = new Engine(app, true)
window.addEventListener("resize", () => engine.resize())

const scene = new Scene(engine)
scene.clearColor = Color3.FromHexString("#0a67a0").toColor4(1)

const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
advancedTexture.useInvalidateRectOptimization = false;

const grid = new HexagonalGrid("base-grid", 0.99, scene)

for (let q = -3; q < 4; q++) {

    for (let r = -3; r < 4; r++) {
        if(q === 0 && r === 0) {
            grid.createTile(q, r, new City("Bern", advancedTexture))
        } else if(q === 1 && r === 2) {
            grid.createTile(q, r, new City("Thun", advancedTexture))
        } else {
            grid.createTile(q, r)
        }
    }
}

grid.addTrack(0, 0, Direction.SOUTH_WEST, Direction.EAST)
grid.addTrack(1, 0, Direction.WEST, Direction.SOUTH_EAST)
grid.addTrack(1, 1, Direction.NORTH_WEST, Direction.SOUTH_WEST)
grid.addTrack(1, 2, Direction.NORTH_EAST, Direction.WEST)
grid.addTrack(0, 2, Direction.EAST, Direction.NORTH_WEST)
grid.addTrack(-1, 1, Direction.SOUTH_EAST, Direction.NORTH_EAST)

const line = new RailwayLine("green")
line.addWaypoint(0, 0)
line.addWaypoint(1, 0)
line.addWaypoint(1, 1)
line.addWaypoint(1, 2)
line.addWaypoint(0, 2)
line.addWaypoint(-1, 1)
line.isRoundtrip = true

grid.addTrack(-1, 2, Direction.SOUTH_EAST, Direction.NORTH_WEST)
grid.addTrack(-2, 1, Direction.SOUTH_EAST, Direction.NORTH_EAST)
grid.addTrack(-1, 0, Direction.SOUTH_WEST, Direction.NORTH_WEST)
grid.addTrack(-2, -1, Direction.SOUTH_EAST, Direction.NORTH_WEST)
const line2 = new RailwayLine("red")
line2.addWaypoint(-1, 2)
line2.addWaypoint(-2, 1)
line2.addWaypoint(-1, 0)
line2.addWaypoint(-2, -1)

const train = new Train("IC61", line, scene, advancedTexture)

const train2 = new Train("S1", line2, scene, advancedTexture)

const light = new HemisphericLight("sun", Vector3.Up(), scene)
light.intensity = 0.7

const camera = new ArcRotateCamera("camera", 0, Math.PI / 4, 8, Vector3.Zero(), scene)
camera.lowerRadiusLimit = 3
camera.upperRadiusLimit = 10
camera.upperBetaLimit = Math.PI / 2 - 0.1
camera.panningAxis = new Vector3(1, 0, 1)
camera.attachControl(app, true)

engine.runRenderLoop(() => {
    train.update(engine.getDeltaTime())
    train2.update(engine.getDeltaTime())
    scene.render()
})
