import {Direction} from "../Direction";
import {Color3, Mesh, MeshBuilder, Node, Scene, StandardMaterial, Vector3} from "@babylonjs/core";

export class Track {

    private fromHalf: Mesh
    private toHalf: Mesh

    constructor(private readonly from: Direction,
                private readonly to: Direction,
                scene: Scene,
                parent: Node,
                width: number = 0.1,
                height: number = 0.01,
                color: Color3 = Color3.Gray(),
                alpha: number = 1
    ) {
        const mat = new StandardMaterial("gray", scene)
        mat.diffuseColor = color
        mat.specularColor = color
        mat.alpha = alpha
        this.fromHalf = MeshBuilder.CreateBox("track", {width: width, height: height, depth: Math.sqrt(3) / 4}, scene)
        this.fromHalf.material = mat
        this.fromHalf.parent = parent
        this.fromHalf.translate(Vector3.Up(), 0.105)
        this.fromHalf.translate(this.from.direction, Math.sqrt(3) / 8)
        this.fromHalf.rotation = this.from.rotation
        this.toHalf = MeshBuilder.CreateBox("track", {width: width, height: height, depth: Math.sqrt(3) / 4}, scene)
        this.toHalf.material = mat
        this.toHalf.parent = parent
        this.toHalf.translate(Vector3.Up(), 0.105)
        this.toHalf.translate(this.to.direction, Math.sqrt(3) / 8)
        this.toHalf.rotation = this.to.rotation
    }

    equals(from: Direction, to: Direction): boolean {
        return (this.from === from && this.to === to) || (this.from === to && this.to === from)
    }

    dispose() {
        this.fromHalf.dispose()
        this.toHalf.dispose()
    }
}
