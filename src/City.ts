import {AdvancedDynamicTexture, Control, Rectangle, TextBlock} from "@babylonjs/gui";
import {Mesh} from "@babylonjs/core";

export class City {

    constructor(readonly name: string, private readonly advancedTexture: AdvancedDynamicTexture) {
    }

    setParent(mesh: Mesh) {
        const nameTag = new Rectangle()
        this.advancedTexture.addControl(nameTag)
        nameTag.width = "100px"
        nameTag.height = "30px"
        nameTag.thickness = 2
        nameTag.linkOffsetY = "-30px"
        nameTag.transformCenterY = 1
        nameTag.alpha = 0.4
        nameTag.cornerRadius = 5
        nameTag.background = "black"
        nameTag.linkWithMesh(mesh)
        const nameText = new TextBlock()
        nameText.text = this.name
        nameText.color = "white"
        nameText.fontSize = "18"
        nameText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        nameText.alpha  = 1
        nameTag.addControl(nameText)
    }
}
