import './style.css'
import {
    ActionManager,
    Animation,
    ArcRotateCamera,
    Color3,
    Engine,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Scene,
    SetValueAction,
    Space,
    StandardMaterial,
    Vector3
} from "@babylonjs/core";

const app = document.querySelector<HTMLCanvasElement>('#app')!

const engine = new Engine(app, true)
window.addEventListener("resize", () => engine.resize())

const scene = new Scene(engine)

const ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene)
const myBox = Mesh.CreateBox("box", 1, scene)

myBox.actionManager = new ActionManager(scene);
myBox.actionManager.registerAction(new SetValueAction(ActionManager.OnPickTrigger, myBox, "isVisible", false))
myBox.translate(Vector3.Up(), 1, Space.WORLD)
const redMaterial = new StandardMaterial("red", scene)

redMaterial.diffuseColor = Color3.Red()
redMaterial.specularColor = Color3.Blue()

myBox.material = redMaterial

const rotationXAnimation = new Animation("rot-x", "rotation.x", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
rotationXAnimation.setKeys([{frame: 0, value: 0}, {frame: 30, value: Math.PI * 2}])

const rotationYAnimation = new Animation("rot-y", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
rotationYAnimation.setKeys([{frame: 0, value: 0}, {frame: 30, value: Math.PI * 2}])

myBox.animations.push(rotationXAnimation)
myBox.animations.push(rotationYAnimation)

const light = new HemisphericLight("sun", Vector3.Up(), scene)
light.intensity = 0.7

const camera = new ArcRotateCamera("camera", 0.5, 0.5, 15, myBox.position.clone(), scene)
camera.lowerRadiusLimit = 5
camera.upperRadiusLimit = 25
camera.lowerBetaLimit = 0
camera.upperBetaLimit = Math.PI / 4
camera.panningAxis = new Vector3(1, 0, 1)
camera.panningDistanceLimit = 5
camera.attachControl(app, true)

scene.beginAnimation(myBox, 0, 30, true, 0.25)

engine.runRenderLoop(() => {
    scene.render()
})
