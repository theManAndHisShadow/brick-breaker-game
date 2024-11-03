import Primitive from "./Primitive";
import { BrickType, ScreenType } from "../global.types";

interface BrickParams {
    health: number,
    width: number;
    height: number;
    x: number;
    y: number;
    color: string;
}

export default class Brick extends Primitive implements BrickType {
    health: number;
    
    constructor(params: BrickParams){
        super(params);

        Object.assign(this, params);
    }

    renderAt(screenReference: ScreenType): void {
        const { context } = screenReference;
        let { x, y, width, height, color } = this;
    
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    }
}