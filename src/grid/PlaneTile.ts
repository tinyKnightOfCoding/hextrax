import {ActionManager, Color3, Mesh, Node, Scene, StandardMaterial} from "@babylonjs/core";
import {BaseTile} from "./BaseTile";

const DEFAULT_COLOR = Color3.FromHexString("#85BF19")

export class PlaneTile extends BaseTile {
    readonly body: Mesh
    readonly isEditable = true

    constructor(
        q: number,
        r: number,
        scene: Scene,
        parent: Node,
        actionManager: ActionManager
    ) {
        super(q, r)
        const mat = new StandardMaterial("tile", scene)
        mat.diffuseColor = DEFAULT_COLOR
        this.body = Mesh.CreateCylinder(this.name, 0.2, 0.99, 0.99, 6, 1, scene)
        this.body.material = mat
        this.body.parent = parent
        this.body.actionManager = actionManager
    }
}
