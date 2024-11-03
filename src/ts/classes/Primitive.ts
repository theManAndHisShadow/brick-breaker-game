import { PrimitiveParams, PrimitiveType, ScreenType } from "../global.types";

export default class Primitive implements PrimitiveType {
    width: number;
    height: number;
    x: number;
    y: number;
    type: string;
    color: string;

    constructor(params: PrimitiveParams){
        Object.assign(this, params);
    }

    renderAt(screenReference: ScreenType): void {
        // empty proto method...
    }
}