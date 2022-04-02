import {ActionManager, Node, Scene, TransformNode, Vector3} from "@babylonjs/core";
import {HexagonTile} from "./HexagonTile";
import {Direction} from "../Direction";
import {City} from "../City";
import {PlaneTile} from "./PlaneTile";
import {StationTile} from "./StationTile";

export class HexagonGrid {

    private readonly gridNode: Node
    private readonly map = new Map<String, HexagonTile>()

    constructor(scene: Scene,
                private readonly tileActionManager: ActionManager) {
        this.gridNode = new TransformNode("grid-node", scene)
    }

    createTile(q: number, r: number) {
        if (this.map.has(`tile-${q}-${r}`)) return
        const newTile = new PlaneTile(`tile-${q}-${r}`, this.gridNode._scene, this.gridNode, this.tileActionManager)
        newTile.setPosition(this.convert(q, r))
        this.map.set(newTile.name, newTile)
    }

    createCityTile(q: number, r: number, city: City) {
        if (this.map.has(`tile-${q}-${r}`)) return
        const newTile = new StationTile(`tile-${q}-${r}`, this.gridNode._scene, this.gridNode, this.tileActionManager, city)
        newTile.setPosition(this.convert(q, r))
        this.map.set(newTile.name, newTile)
    }

    placeTrack(q: number, r: number, from: Direction, to: Direction) {
        const newTrack = this.findTile(q, r)?.addTrack(from, to);
        if (!newTrack) {
            return
        }
        this.findNeighbourTile(q, r, from)?.tracksByDirection(from.opposite)?.forEach(t => t.addNeighbour(newTrack))
        this.findNeighbourTile(q, r, to)?.tracksByDirection(to.opposite)?.forEach(t => t.addNeighbour(newTrack))
    }

    private findNeighbourTile(q: number, r: number, direction: Direction): HexagonTile | undefined {
        return this.findTile(q + direction.qDiff, r + direction.rDiff)
    }

    private findTile(q: number, r: number): HexagonTile | undefined {
        return this.map.get(`tile-${q}-${r}`)
    }

    tileByName(name: string): HexagonTile {
        return this.map.get(name)!!
    }

    cityByName(name: string): City {
        for (const tile of this.map.values()) {
            if (tile?.city?.name === name) {
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
