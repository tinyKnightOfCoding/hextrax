import {AdvancedDynamicTexture, Control, Rectangle, TextBlock} from '@babylonjs/gui'
import {Mesh} from '@babylonjs/core'
import {Passenger} from './passenger'
import {Simulation} from './Simulation'

export class City {

    private passengers: Passenger[] = []
    private readonly capacity = 75
    private readonly nameBox: Rectangle
    private readonly nameTag: TextBlock

    constructor(readonly name: string, private readonly simulation: Simulation, ui: AdvancedDynamicTexture) {
        this.nameBox = new Rectangle()
        ui.addControl(this.nameBox)
        this.nameBox.width = '140px'
        this.nameBox.height = '30px'
        this.nameBox.thickness = 2
        this.nameBox.linkOffsetY = '-30px'
        this.nameBox.transformCenterY = 1
        this.nameBox.alpha = 0.4
        this.nameBox.cornerRadius = 5
        this.nameBox.background = 'black'
        this.nameTag = new TextBlock()
        this.nameTag.fontSize = '18'
        this.nameTag.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
        this.nameTag.alpha = 1
        this.nameTag.color = 'white'
        this.updateTextBlock()
        this.nameBox.addControl(this.nameTag)
    }

    get isOverflowing(): boolean {
        return this.capacity < this.passengers.length
    }

    setParent(mesh: Mesh) {
        this.nameBox.linkWithMesh(mesh)
    }

    addPassenger(passenger: Passenger) {
        this.passengers.push(passenger)
        this.nameTag.text = `${this.name} (${this.passengers.length} / ${this.capacity})`
    }

    addPassengers(...passengers: Passenger[]) {
        const rp = passengers.filter(p => !p.reachedDestination)
        this.passengers.push(...rp)
        rp.forEach(p => p.dispose())
        this.simulation.incrementPassengerCount(passengers.length - rp.length)
        this.updateTextBlock()
    }

    getAndRemovePassengers(lineName: string, stopIndex: number, max: number): Passenger[] {
        let remainingPassengers = this.passengers.filter(p => !p.wantsBoard(lineName, stopIndex))
        let leavingPassengers = this.passengers.filter(p => p.wantsBoard(lineName, stopIndex))
        if (leavingPassengers.length > max) {
            remainingPassengers = [...remainingPassengers, ...leavingPassengers.slice(max, leavingPassengers.length)]
            leavingPassengers = leavingPassengers.slice(0, max)
        }
        this.passengers = remainingPassengers
        this.updateTextBlock()
        return leavingPassengers
    }

    private updateTextBlock() {
        this.nameTag.text = `${this.name} (${this.passengers.length} / ${this.capacity})`
    }
}
