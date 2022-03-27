import {Node, Scene, TransformNode, Vector3} from "@babylonjs/core";
import {HexagonTile} from "./HexagonTile";
import {Direction} from "./Direction";
import {Track} from "./Track";
import {City} from "./City";

export class HexagonalGrid {

    private readonly gridNode: Node
    private readonly map = new Map<String, HexagonTile>()

    constructor(scene: Scene) {
        this.gridNode = new TransformNode("grid-node", scene)
    }

    createTile(q: number, r: number, city?: City) {
        const newTile = new HexagonTile(`tile-${q}-${r}`, 0.99, this.gridNode._scene, this.gridNode, city)
        newTile.setPosition(this.convert(q, r))
        this.map.set(newTile.name, newTile)
    }

    addTrack(q: number, r: number, from: Direction, to: Direction) {
        const tile = this.map.get(`tile-${q}-${r}`)
        tile?.addTrack(from, to)
    }

    getTrack(q: number, r: number, from: Direction, to: Direction): Track | undefined {
        const tile = this.map.get(`tile-${q}-${r}`)
        return tile?.getTrack(from, to)
    }

    private convert(q: number, r: number): Vector3 {
        const z = (q + (r / 2)) * Math.sqrt(3) / 2
        const x = r * 0.75
        return new Vector3(x, 0, z)
    }
}
