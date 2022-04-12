import {Mesh, MeshBuilder, Scene, StandardMaterial, Vector3} from '@babylonjs/core'
import {RailwayLine} from '../line'
import {Simulation} from '../Simulation'
import {Track} from '../track'
import {BaseEditState} from './BaseEditState'

export class LineEditState extends BaseEditState {
    highlight: Mesh[] = []

    constructor(private readonly scene: Scene,
                readonly line: RailwayLine,
                private readonly sim: Simulation,
    ) {
        super('LINE')
    }

    onDestroy(): void {
        this.highlight.forEach(h => h.dispose())
    }

    onCreate() {
        console.log('edit line ', this.line.name)
        this.updateHighlight()
    }

    onKeyup(code: string) {
        if (code === 'NumpadAdd' && this.sim.inventory.useTrain()) {
            this.sim.placeTrain('T' + (String(this.sim.trainCount + 1).padStart(3, '0')), this.line)
        }
    }

    private updateHighlight() {
        this.highlight.forEach(h => h.dispose())
        this.highlight = []

        const mat = new StandardMaterial(this.line.name, this.scene)
        mat.diffuseColor = this.line.color
        mat.specularColor = this.line.color
        mat.alpha = 0.5
        for(const city of this.line.oneWayRoute) {
            const mesh = Mesh.CreateCylinder('city-mesh', 0.3, 0.4, 0.4, 6, 1, this.scene)
            mesh.material = mat
            mesh.position = city.nameBox._linkedMesh?.position.clone() ?? Vector3.Zero()
            this.highlight.push(mesh)
        }
        if (this.line.waypoints.length < 2) return
        for (let i = 0; i < (this.line.waypoints.length / 2) - 1; i++) {
            const origin = this.line.waypoints[i].coordinate.clone()
            const destination = this.line.waypoints[i + 1].coordinate.clone()

            const mesh = MeshBuilder.CreateBox('track', {
                width: 0.2,
                height: 0.03,
                depth: (Math.sqrt(3) / 2) - 0.15,
            }, this.scene)
            mesh.material = mat
            mesh.position = origin
            mesh.lookAt(destination)
            mesh.translate(Vector3.Forward(), Math.sqrt(3) / 4)
            this.highlight.push(mesh)
        }
    }

    pickTrack(track: Track): void {
        if (track?.station) {
            console.log('picked track ', track?.station?.name)
            this.line.addStopAt(track.station!!)
            this.updateHighlight()
        }
    }
}
