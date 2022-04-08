import {RailwayLine, Waypoint} from '../line'
import {Mesh, MeshBuilder, Scene, StandardMaterial, Vector3} from '@babylonjs/core'
import {AdvancedDynamicTexture, Control, Rectangle, TextBlock} from '@babylonjs/gui'
import {Passenger} from '../passenger/Passenger'
import {Simulation} from '../Simulation'

type TrainState = 'STOP' | 'TRAVEL'

export class Train {

    private readonly body: Mesh
    private remainingWaypoints: Waypoint[] = []
    private velocity: number = 0.75
    private distanceTravelledOnCurrentSegment: number = 0
    private state: TrainState = 'TRAVEL'
    private stopDuration = 0
    private passengers: Passenger[] = []
    private readonly nameText: TextBlock
    private stopIndex = 0

    constructor(
        readonly name: string,
        private readonly line: RailwayLine,
        private readonly simulation: Simulation,
        scene: Scene,
        advancedTexture: AdvancedDynamicTexture,
    ) {
        const mat = new StandardMaterial('gray', scene)
        mat.diffuseColor = this.line.color
        mat.specularColor = this.line.color
        this.body = MeshBuilder.CreateBox('train', {height: 0.12, width: 0.09, depth: 0.3}, scene)
        this.body.material = mat
        const nameTag = new Rectangle()
        advancedTexture.addControl(nameTag)
        nameTag.width = '80px'
        nameTag.height = '30px'
        nameTag.thickness = 2
        nameTag.linkOffsetY = '-30px'
        nameTag.transformCenterY = 1
        nameTag.alpha = 0.4
        nameTag.cornerRadius = 5
        nameTag.background = 'black'
        nameTag.linkWithMesh(this.body)
        this.nameText = new TextBlock()
        this.nameText.text = `${this.name} (${this.passengers.length})`
        this.nameText.color = 'white'
        this.nameText.fontSize = '18'
        this.nameText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
        this.nameText.alpha = 1
        nameTag.addControl(this.nameText)
        this.setWaypoints()
    }

    update(delta: number) {
        if (this.state === 'STOP') {
            if (this.stopDuration === 0) {
                this.deboardPassengers()
                this.nameText.text = `${this.name} (${this.passengers.length})`
            }
            this.stopDuration += delta
            if (this.stopDuration > 1000) {
                this.stopDuration = 0
                this.boardPassengers()
                this.nameText.text = `${this.name} (${this.passengers.length})`
                this.state = 'TRAVEL'
                this.stopIndex++
            }
            return
        }
        const distanceTravelled = this.velocity * delta / 1000
        this.distanceTravelledOnCurrentSegment += distanceTravelled
        if (this.distanceTravelledOnCurrentSegment > Math.sqrt(3) / 2) {
            this.distanceTravelledOnCurrentSegment -= Math.sqrt(3) / 2
            this.reachWaypoint()
            if (this.state === 'TRAVEL') {
                this.body.translate(Vector3.Forward(), this.distanceTravelledOnCurrentSegment)
            }
        } else {
            this.body.translate(Vector3.Forward(), distanceTravelled)
        }
    }

    private deboardPassengers() {
        const city = this.simulation.cityByName(this.remainingWaypoints[0]!!.stopName!!)
        const remainingPassengers = this.passengers.filter(p => !p.wantsDeboard(city))
        const leavingPassengers = this.passengers.filter(p => p.wantsDeboard(city))
        this.passengers = remainingPassengers
        leavingPassengers.forEach(p => p.deboard())
        city.addPassengers(...leavingPassengers)
    }

    private boardPassengers() {
        const city = this.simulation.cityByName(this.remainingWaypoints[0]!!.stopName!!)
        this.passengers.push(...city.getAndRemovePassengers(this.line.name, this.stopIndex))
    }

    private setWaypoints() {
        this.remainingWaypoints = this.line.waypoints
        this.stopIndex = 0
        this.body.position = this.remainingWaypoints[0]!!.coordinate.clone()
        if (this.remainingWaypoints[0]!!.stopName) {
            this.state = 'STOP'
        }
        this.calculateDirection()
    }

    private reachWaypoint() {
        this.remainingWaypoints.shift()
        if (this.remainingWaypoints.length < 2) {
            this.setWaypoints()
        } else {
            this.calculateDirection()
        }
        if (this.remainingWaypoints[0]!!.stopName) {
            this.state = 'STOP'
        }
    }

    private calculateDirection() {
        this.body.lookAt(this.remainingWaypoints[1].coordinate)
    }
}
