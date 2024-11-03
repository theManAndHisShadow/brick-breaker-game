import Primitive from "./Primitive";
import { PlatformType, PrimitiveParams, ScreenType } from "../global.types";

export default class Platform extends Primitive implements PlatformType {
    constructor(params: PrimitiveParams){
        super(params);
    }

    renderAt(screenReference: ScreenType): void {
        const { context } = screenReference;
        let { x, y, width, height, color } = this;
    
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    }
}