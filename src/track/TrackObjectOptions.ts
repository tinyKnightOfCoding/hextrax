import {ActionManager, Color3} from "@babylonjs/core";

export function defaultTrackObjectOptions(): TrackObjectOptions {
    return {
        width: 0.1,
        height: 0.01,
        color: Color3.Gray(),
        alpha: 1,
    }
}

export interface TrackObjectOptions {
    width: number,
    height: number,
    color: Color3,
    alpha: number,
    actionManager?: ActionManager,
}
