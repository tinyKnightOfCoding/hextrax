import {AbstractMesh, ActionManager, Node, Scene, TransformNode, Vector3} from "@babylonjs/core";
import {HexagonTile} from "./HexagonTile";
import {Direction} from "../Direction";
import {City} from "../City";
import {PlaneTile} from "./PlaneTile";
import {StationTile} from "./StationTile";
import {Track, TrackGraph} from "../track";

export class HexagonGrid {

    private readonly gridNode: Node
    private readonly map = new Map<String, HexagonTile>()
    readonly trackGraph = new TrackGraph()

    constructor(scene: Scene,
                private readonly tileActionManager: ActionManager,
                private readonly trackActionManager: ActionManager,
    ) {
        this.gridNode = new TransformNode("grid-node", scene)
    }

    createTile(q: number, r: number) {
        if (this.map.has(`tile-${q}-${r}`)) return
        const newTile = new PlaneTile(q, r, this.gridNode._scene, this.gridNode, this.tileActionManager)
        newTile.setPosition(this.convert(q, r))
        this.map.set(newTile.name, newTile)
    }

    createCityTile(q: number, r: number, city: City, from: Direction, to: Direction) {
        if (this.map.has(`tile-${q}-${r}`)) return
        const newTile = new StationTile(q, r, this.gridNode._scene, this.gridNode, this.tileActionManager, city)
        newTile.setPosition(this.convert(q, r))
        this.map.set(newTile.name, newTile)
        this.placeTrack(q, r, from, to, city)
        this.trackGraph.afterCityAdded(city)
    }

    placeTrack(q: number, r: number, from: Direction, to: Direction, station?: City): void {
        const newTrack = this.findTile(q, r)?.addTrack(from, to, this.trackActionManager, !!station, station);
        if (!newTrack) {
            return
        }
        (this.findNeighbourTile(q, r, from)?.tracksByDirection(from.opposite) ?? []).forEach((t: Track) => {
            t.addNeighbour(newTrack, from.opposite)
            newTrack.addNeighbour(t, from)
        });
        (this.findNeighbourTile(q, r, to)?.tracksByDirection(to.opposite) ?? []).forEach((t: Track) => {
            t.addNeighbour(newTrack, to.opposite)
            newTrack.addNeighbour(t, to)
        });
        this.trackGraph.afterTrackAdded(newTrack)
    }

    removeTrack(track: Track) {
        const tile = this.tileByName(track.parent.name)
        tile.removeTrack(track)
        this.findNeighbourTile(tile.q, tile.r, track.from)?.tracksByDirection(track.from.opposite)?.forEach(t => t.removeNeighbour(track))
        this.findNeighbourTile(tile.q, tile.r, track.to)?.tracksByDirection(track.to.opposite)?.forEach(t => t.removeNeighbour(track))
        track.dispose()
        this.trackGraph.afterTrackRemoved(track)
    }

    trackByMesh(mesh: AbstractMesh): Track {
        for (const tile of this.map.values()) {
            const track = tile.trackByMesh(mesh)
            if (track) {
                return track
            }
        }
        throw new Error(`track not found ${mesh.name}`)
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
