import {Direction} from "../Direction";
import {Node, Scene} from "@babylonjs/core";
import {TrackObject} from "./TrackObject";
import {TrackObjectOptions} from "./TrackObjectOptions";

export class Track {

    private readonly object: TrackObject

    constructor(private readonly from: Direction,
                private readonly to: Direction,
                scene: Scene,
                parent: Node,
                options?: Partial<TrackObjectOptions>
    ) {
        this.object = new TrackObject(this.from, this.to, scene, parent, options)
    }

    equals(from: Direction, to: Direction): boolean {
        return (this.from === from && this.to === to) || (this.from === to && this.to === from)
    }

    dispose() {
        this.object.dispose()
    }
}
