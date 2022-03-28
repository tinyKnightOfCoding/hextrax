import {AdvancedDynamicTexture, Control, Rectangle, TextBlock} from "@babylonjs/gui";
import {Mesh} from "@babylonjs/core";
import {Passenger} from "./Passenger";
import {Simulation} from "./Simulation";

export class City {

    private passengers: Passenger[] = []
    private readonly nameBox: Rectangle
    private readonly nameTag: TextBlock

    constructor(readonly name: string, private readonly simulation: Simulation, ui: AdvancedDynamicTexture) {
        this.nameBox = new Rectangle()
        ui.addControl(this.nameBox)
        this.nameBox.width = "120px"
        this.nameBox.height = "30px"
        this.nameBox.thickness = 2
        this.nameBox.linkOffsetY = "-30px"
        this.nameBox.transformCenterY = 1
        this.nameBox.alpha = 0.4
        this.nameBox.cornerRadius = 5
        this.nameBox.background = "black"
        this.nameTag = new TextBlock()
        this.nameTag.text = `${this.name} (${this.passengers.length})`
        this.nameTag.color = "white"
        this.nameTag.fontSize = "18"
        this.nameTag.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.nameTag.alpha = 1
        this.nameBox.addControl(this.nameTag)
    }

    setParent(mesh: Mesh) {
        this.nameBox.linkWithMesh(mesh)
    }

    addPassenger(passenger: Passenger) {
        this.passengers.push(passenger)
        this.nameTag.text = `${this.name} (${this.passengers.length})`
    }

    addPassengers(...passengers: Passenger[]) {
        const rp = passengers.filter(p => !p.reachedDestination)
        this.passengers.push(...rp)
        this.simulation.incrementPassengerCount(passengers.length - rp.length)
        this.nameTag.text = `${this.name} (${this.passengers.length})`
    }

    getAndRemovePassengers(lineName: string, stopIndex: number): Passenger[] {
        const remainingPassengers = this.passengers.filter(p => !p.wantsBoard(lineName, stopIndex))
        const leavingPassengers = this.passengers.filter(p => p.wantsBoard(lineName, stopIndex))
        this.passengers = remainingPassengers
        this.nameTag.text = `${this.name} (${this.passengers.length})`
        return leavingPassengers
    }
}
