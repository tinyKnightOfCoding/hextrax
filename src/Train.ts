import {RailwayLine} from "./RailwayLine";
import {Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3} from "@babylonjs/core";

export class Train {

    private readonly body: Mesh
    private remainingWaypoints: Vector3[] = []
    private velocity: number = 0.35
    private distanceTravelledOnCurrentSegment: number = 0
    private currentDirection: Vector3 = Vector3.Forward()

    constructor(private readonly line: RailwayLine, scene: Scene) {
        const mat = new StandardMaterial("gray", scene)
        mat.diffuseColor = Color3.Gray()
        mat.specularColor = Color3.Gray()
        this.body = MeshBuilder.CreateBox("train", {height: 0.12, width: 0.09, depth: 0.3}, scene)
        this.body.material = mat
        this.remainingWaypoints = line.waypoints
        this.reachWaypoint()
    }

    update(delta: number) {
        const distanceTravelled = this.velocity * delta / 1000
        this.distanceTravelledOnCurrentSegment += distanceTravelled
        if(this.distanceTravelledOnCurrentSegment > Math.sqrt(3) / 2) {
            this.reachWaypoint()
            this.distanceTravelledOnCurrentSegment -= Math.sqrt(3) / 2
            this.body.translate(Vector3.Forward(), this.distanceTravelledOnCurrentSegment)
        } else {
            this.body.translate(Vector3.Forward(), distanceTravelled)
        }
    }

    private reachWaypoint() {
        const firstWaypoint = this.remainingWaypoints.shift()!!
        if(this.remainingWaypoints.length === 0) {
            this.remainingWaypoints = this.line.waypoints
        }
        const nextWaypoint = this.remainingWaypoints[0]!!
        const oldDirection = this.currentDirection
        this.currentDirection = new Vector3(nextWaypoint.x - firstWaypoint.x, nextWaypoint.y - firstWaypoint.y, nextWaypoint.z - firstWaypoint.z).normalize()
        const angle = Vector3.GetAngleBetweenVectors(oldDirection, this.currentDirection, Vector3.Up())
        this.body.position = firstWaypoint
        this.body.rotate(Vector3.Up(), angle)
    }

}