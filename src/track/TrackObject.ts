import {AbstractMesh, Mesh, MeshBuilder, Node, Scene, StandardMaterial, Vector3} from '@babylonjs/core'
import {Direction} from '../grid'
import {defaultTrackObjectOptions, TrackObjectOptions} from './TrackObjectOptions'

export class TrackObject {
    private readonly meshes: Mesh[] = []

    constructor(
        from: Direction,
        to: Direction,
        scene: Scene,
        parent: Node,
        options: Partial<TrackObjectOptions> = {},
    ) {
        this.createMeshes(options, scene, parent, from, to)
        if (options.actionManager) {
            this.meshes.forEach(m => m.actionManager = options.actionManager!!)
        }
    }

    private createMeshes(options: Partial<TrackObjectOptions>, scene: Scene, parent: Node, from: Direction, to: Direction) {
        const {color, alpha, width, height} = {...defaultTrackObjectOptions(), ...options}
        const mat = new StandardMaterial('gray', scene)
        mat.diffuseColor = color
        mat.specularColor = color
        mat.alpha = alpha
        if(from.opposite === to) {
            const m = MeshBuilder.CreateBox('track', {width: width, height: height, depth: Math.sqrt(3) / 2}, scene)
            m.material = mat
            m.parent = parent
            m.translate(Vector3.Up(), 0.105)
            m.rotation = from.rotation
            this.meshes.push(m)
        } else {
            const fromH = MeshBuilder.CreateBox('track', {width: width, height: height, depth: Math.sqrt(3) / 6}, scene)
            fromH.material = mat
            fromH.parent = parent
            fromH.translate(Vector3.Up(), 0.105)
            fromH.translate(from.direction, Math.sqrt(3) / 6)
            fromH.rotation = from.rotation
            const toH = MeshBuilder.CreateBox('track', {width: width, height: height, depth: Math.sqrt(3) / 6}, scene)
            toH.material = mat
            toH.parent = parent
            toH.translate(Vector3.Up(), 0.105)
            toH.translate(to.direction, Math.sqrt(3) / 6)
            toH.rotation = to.rotation

            const middleH = MeshBuilder.CreateBox('track', {width: width, height: height, depth: Math.sqrt(3) / 6}, scene)
            middleH.material = mat
            middleH.parent = parent
            const fromPos = fromH.position
            const toPos = toH.position
            middleH.position = new Vector3((fromPos.x + toPos.x) / 4, 0.105, (fromPos.z + toPos.z) / 4)
            let yRot = (from.rotation.y - to.rotation.y)
            // fix two combinations :D
            if((to === Direction.NORTH_EAST && from === Direction.SOUTH_EAST) || (to === Direction.NORTH_WEST && from === Direction.SOUTH_WEST)) {
                yRot = Math.PI
            }
            middleH.rotation = new Vector3(0, yRot, 0)
            middleH.rotation = middleH.rotation.add(new Vector3(0, Math.PI / 2, 0))

            this.meshes.push(fromH)
            this.meshes.push(toH)
            this.meshes.push(middleH)
        }
    }

    hasMesh(mesh: AbstractMesh): boolean {
        return this.meshes.some(m => m === mesh)
    }

    dispose() {
        this.meshes.forEach(m => m.dispose())
    }
}
