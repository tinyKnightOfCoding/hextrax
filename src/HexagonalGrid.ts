import {Node, Scene, TransformNode, Vector3} from "@babylonjs/core";
import {HexagonTile} from "./HexagonTile";
import {Direction} from "./Direction";

export class HexagonalGrid {

    private readonly gridNode: Node
    private readonly map = new Map<String, HexagonTile>()

    constructor(name: string,
                private readonly tileSize: number,
                scene: Scene) {
        this.gridNode = new TransformNode(name, scene)
    }

    createTile(q: number, r: number) {
        const newTile = new HexagonTile(`tile-${q}-${r}`, this.tileSize, this.gridNode._scene, this.gridNode)
        newTile.setPosition(this.convert(q, r))
        this.map.set(newTile.name, newTile)
    }

    addTrack(q: number, r: number, from: Direction, to: Direction) {
        const tile = this.map.get(`tile-${q}-${r}`)
        tile?.addTrack(from, to)
    }

    private convert(q: number, r: number): Vector3 {
        const z = ((q) + ((r & 1) * 0.5)) * Math.sqrt(3) * 0.5
        const x = r * 0.75
        return new Vector3(x, 0, z)
    }
}
