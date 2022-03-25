import {Color3, Mesh, Node, Scene, StandardMaterial, Vector3} from "@babylonjs/core";
import {Direction} from "./Direction";
import {Track} from "./Track";

export class HexagonTile {

    private readonly body: Mesh
    private readonly tracks: Track[] = []

    constructor(name: string, diameter: number, scene: Scene, parent: Node) {
        const redMaterial = new StandardMaterial("red", scene)
        redMaterial.diffuseColor = Color3.FromHexString("#85bf19")
        redMaterial.specularColor = Color3.FromHexString("#85bf19")
        this.body = Mesh.CreateCylinder(name, 0.2, diameter, diameter, 6, 1, scene)
        this.body.material = redMaterial
        this.body.parent = parent
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
