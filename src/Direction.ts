import {Vector3} from "@babylonjs/core";

export class Direction {
    static WEST = new Direction(
        -1,
        0,
        new Vector3(0, 0, 0),
        new Vector3(0, 0, -1)
    )
    static NORTH_WEST = new Direction(
        -1,
        -1,
        new Vector3(0, Math.PI / 3, 0),
        // Vector3.Zero(),
        new Vector3(-3.5, 0, -2).normalize()
    )
    static NORTH_EAST = new Direction(
        1,
        -1,
        new Vector3(0, Math.PI * 2 / 3, 0),
        new Vector3(-3.5, 0, 2).normalize()
    )
    static EAST = new Direction(1, 0, new Vector3(0, Math.PI, 0), new Vector3(0, 0, 1))
    static SOUTH_WEST = new Direction(-1, 1, new Vector3(0, -Math.PI / 3, 0), new Vector3(3.5, 0, -2).normalize())
    static SOUTH_EAST = new Direction(
        1,
        1,
        new Vector3(0, -Math.PI / 3 * 2, 0),
        new Vector3(3.5, 0, 2).normalize()
    )

    private constructor(private readonly qDiff: number,
                        private readonly rDiff: number,
                        private readonly _rotation: Vector3,
                        private readonly _direction: Vector3,
    ) {
    }

    get rotation(): Vector3 {
        return this._rotation.clone()
    }

    get direction(): Vector3 {
        return this._direction.clone()
    }

}
