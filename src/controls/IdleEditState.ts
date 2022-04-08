import {BaseEditState} from "./BaseEditState";

export class IdleEditState extends BaseEditState{

    static INSTANCE = new IdleEditState()

    private constructor() {
        super('IDLE')
    }
}
