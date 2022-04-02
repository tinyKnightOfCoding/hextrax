import {ActionManager, Color3, Mesh, Node, Scene, StandardMaterial} from "@babylonjs/core";
import {City} from "../City";
import {BaseTile} from "./BaseTile";

const CITY_COLOR = Color3.FromHexString("#F09E58")

export class StationTile extends BaseTile {

    readonly body: Mesh

    constructor(
        readonly name: string,
        scene: Scene,
        parent: Node,
        actionManager: ActionManager,
        readonly city: City
    ) {
        super()
        const mat = new StandardMaterial("tile", scene)
        mat.diffuseColor = CITY_COLOR
        this.body = Mesh.CreateCylinder(name, 0.2, 0.99, 0.99, 6, 1, scene)
        this.body.material = mat
        this.body.parent = parent
        this.body.actionManager = actionManager
        this.city.setParent(this.body)
    }
}
