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

    updateHealth(health: number): void {
        this.health = health;

        this.color = this.getColorBasedOnHealth(health);
    }

    getColorBasedOnHealth(health: number): string {
        const colors = [
            'rgba(255, 255, 255, 0.05)', // 0
            'rgba(0, 0, 255, 0.2)', // 1
            'rgba(0, 0, 255, 0.4)', // 2
            'rgba(0, 0, 255, 0.6)', // 3
            'rgba(0, 0, 255, 0.8)', // 4
            'rgba(0, 0, 255, 1)', // 5
        ];

        return colors[health];
    }

    renderAt(screenReference: ScreenType): void {
        const { context } = screenReference;
        let { x, y, width, height, color } = this;
    
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    }
}