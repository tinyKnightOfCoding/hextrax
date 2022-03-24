import './style.css'
import {ArcRotateCamera, Color3, Engine, HemisphericLight, Scene, Vector3} from "@babylonjs/core";
import {HexagonalGrid} from "./HexagonalGrid";
import {Direction} from "./Direction";

const app = document.querySelector<HTMLCanvasElement>('#app')!

const engine = new Engine(app, true)
window.addEventListener("resize", () => engine.resize())

const scene = new Scene(engine)
scene.clearColor = Color3.FromHexString("#0a67a0").toColor4(1)

const grid = new HexagonalGrid("base-grid", 0.99, scene)

for (let q = -3; q < 4; q++) {

    for (let r = -3; r < 4; r++) {
        grid.createTile(q, r)
    }
}

grid.addTrack(0, 0, Direction.SOUTH_WEST, Direction.EAST)
grid.addTrack(1, 0, Direction.WEST, Direction.SOUTH_EAST)
grid.addTrack(1, 1, Direction.NORTH_WEST, Direction.SOUTH_WEST)
grid.addTrack(1, 2, Direction.NORTH_EAST, Direction.WEST)
grid.addTrack(0, 2, Direction.EAST, Direction.NORTH_WEST)
grid.addTrack(-1, 1, Direction.SOUTH_EAST, Direction.NORTH_EAST)

const light = new HemisphericLight("sun", Vector3.Up(), scene)
light.intensity = 0.7

const camera = new ArcRotateCamera("camera", 0, Math.PI / 4, 8, Vector3.Zero(), scene)
camera.lowerRadiusLimit = 3
camera.upperRadiusLimit = 10
camera.upperBetaLimit = Math.PI / 2 - 0.1
camera.panningAxis = new Vector3(1, 0, 1)
camera.attachControl(app, true)

engine.runRenderLoop(() => {
    scene.render()
})
