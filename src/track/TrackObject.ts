import {AbstractMesh, Mesh, MeshBuilder, Node, Scene, StandardMaterial, Vector3} from "@babylonjs/core";
import {Direction} from "../Direction";
import {defaultTrackObjectOptions, TrackObjectOptions} from "./TrackObjectOptions";

export class TrackObject {
    private fromHalf: Mesh
    private toHalf: Mesh

    constructor(
        from: Direction,
        to: Direction,
        scene: Scene,
        parent: Node,
        options: Partial<TrackObjectOptions> = {}
    ) {
        const {color, alpha, width, height} = {...defaultTrackObjectOptions(), ...options}
        const mat = new StandardMaterial("gray", scene)
        mat.diffuseColor = color
        mat.specularColor = color
        mat.alpha = alpha
        this.fromHalf = MeshBuilder.CreateBox("track", {width: width, height: height, depth: Math.sqrt(3) / 4}, scene)
        this.fromHalf.material = mat
        this.fromHalf.parent = parent
        this.fromHalf.translate(Vector3.Up(), 0.105)
        this.fromHalf.translate(from.direction, Math.sqrt(3) / 8)
        this.fromHalf.rotation = from.rotation
        this.toHalf = MeshBuilder.CreateBox("track", {width: width, height: height, depth: Math.sqrt(3) / 4}, scene)
        this.toHalf.material = mat
        this.toHalf.parent = parent
        this.toHalf.translate(Vector3.Up(), 0.105)
        this.toHalf.translate(to.direction, Math.sqrt(3) / 8)
        this.toHalf.rotation = to.rotation
        if(options.actionManager) {
            this.toHalf.actionManager = options.actionManager
            this.fromHalf.actionManager = options.actionManager
        }
    }

    hasMesh(mesh: AbstractMesh): boolean {
        return this.fromHalf === mesh || this.toHalf === mesh
    }

    dispose() {
        this.fromHalf.dispose()
        this.toHalf.dispose()
    }
}
