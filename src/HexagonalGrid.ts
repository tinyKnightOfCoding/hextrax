import {Node, Scene, TransformNode, Vector3} from "@babylonjs/core";
import {HexagonTile} from "./HexagonTile";
import {Direction} from "./Direction";
import {City} from "./City";

export class HexagonalGrid {

    private readonly gridNode: Node
    private readonly map = new Map<String, HexagonTile>()

    constructor(scene: Scene) {
        this.gridNode = new TransformNode("grid-node", scene)
    }

    createTile(q: number, r: number) {
        const newTile = new HexagonTile(`tile-${q}-${r}`, 0.99, this.gridNode._scene, this.gridNode)
        newTile.setPosition(this.convert(q, r))
        this.map.set(newTile.name, newTile)
    }

    placeCity(q: number, r: number, city: City) {
        this.map.get(`tile-${q}-${r}`)?.placeCity(city)
    }

    placeTrack(q: number, r: number, from: Direction, to: Direction) {
        this.map.get(`tile-${q}-${r}`)?.addTrack(from, to)
    }

    cityByName(name: string): City {
        for(const tile of this.map.values()) {
            if(tile?.city?.name === name) {
                return tile.city
            }
        }
        throw new Error("city not found")
    }

    private convert(q: number, r: number): Vector3 {
        const z = (q + (r / 2)) * Math.sqrt(3) / 2
        const x = r * 0.75
        return new Vector3(x, 0, z)
    }
}
