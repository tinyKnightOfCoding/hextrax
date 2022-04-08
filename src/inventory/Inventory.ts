import {AdvancedDynamicTexture, Control, TextBlock} from '@babylonjs/gui'

export class Inventory {

    private _tracks = 0
    private _trains = 0
    private readonly trackCountText: TextBlock
    private readonly trainCountText: TextBlock

    constructor(ui: AdvancedDynamicTexture) {
        this.trackCountText = new TextBlock()
        this.trackCountText.color = 'white'
        this.trackCountText.fontSize = '20px'
        this.trackCountText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        this.trackCountText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
        this.trackCountText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
        this.trackCountText.top = '55px'
        this.trackCountText.left = '8px'
        this.trackCountText.resizeToFit = true
        this.trackCountText.text = `Tracks remaining: ${this.tracks}`
        ui.addControl(this.trackCountText)
        this.trainCountText = new TextBlock()
        this.trainCountText.color = 'white'
        this.trainCountText.fontSize = '20px'
        this.trainCountText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        this.trainCountText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
        this.trainCountText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
        this.trainCountText.top = '70'
        this.trainCountText.left = '8px'
        this.trainCountText.resizeToFit = true
        this.trainCountText.text = `Trains remaining: ${this.trains}`
        ui.addControl(this.trainCountText)
    }

    get tracks(): number {
        return this._tracks
    }

    get trains(): number {
        return this._trains
    }

    useTrack(): boolean {
        if (this._tracks > 0) {
            this._tracks--
            this.trackCountText.text = `Tracks remaining: ${this.tracks}`
            return true
        }
        return false
    }

    useTrain(): boolean {
        if (this._trains > 0) {
            this._trains--
            this.trainCountText.text = `Trains remaining: ${this.trains}`
            return true
        }
        return false
    }

    addTracks(amount: number) {
        this._tracks += amount
        this.trackCountText.text = `Tracks remaining: ${this.tracks}`
    }

    addTrains(amount: number) {
        this._trains += amount
        this.trainCountText.text = `Trains remaining: ${this.trains}`
    }
}
