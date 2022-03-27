import {Color3, Mesh, Node, Scene, StandardMaterial, Vector3} from "@babylonjs/core";
import {Direction} from "./Direction";
import {Track} from "./Track";
import {City} from "./City";

const CITY_COLOR = Color3.FromHexString("#F09E58")
const DEFAULT_COLOR = Color3.FromHexString("#85BF19")

export class HexagonTile {

    private readonly body: Mesh
    private readonly mat: StandardMaterial
    private readonly tracks: Track[] = []
    private _city?: City

    constructor(
        name: string,
        diameter: number,
        scene: Scene,
        parent: Node) {
        this.mat = new StandardMaterial("tile", scene)
        this.mat.diffuseColor = this.mat.specularColor = DEFAULT_COLOR
        this.body = Mesh.CreateCylinder(name, 0.2, diameter, diameter, 6, 1, scene)
        this.body.material = this.mat
        this.body.parent = parent
    }

    placeCity(city: City) {
        this._city = city
        this.mat.diffuseColor = this.mat.specularColor = CITY_COLOR
        this._city.setParent(this.body)
    }

    get city(): City | undefined {
        return this._city
    }

    addTrack(from: Direction, to: Direction) {
        if (this.tracks.length < 3 && !this.tracks.some(t => t.equals(from, to))) {
            this.tracks.push(new Track(from, to, this.body._scene, this.body))
        }
    }

    getTrack(from: Direction, to: Direction) {
        return this.tracks.find(t => t.equals(from, to))
    }

    setPosition(newPosition: Vector3) {
        this.body.position = newPosition.clone()
    }

    get name(): string {
        return this.body.name
    }
}
