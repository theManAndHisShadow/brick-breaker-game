import Primitive from "./Primitive";
import { BrickType, ScreenType, TextureType } from "../../global.types";
import Texture from "./Texture";

interface BrickParams {
    health: number,
    width: number,
    height: number,
    x: number,
    y: number,
    color: string,
    texture: string,
}

export default class Brick extends Primitive implements BrickType {
    health: number;
    texture: TextureType;
    
    constructor(params: BrickParams){
        super(params);

        Object.assign(this, params);

        this.texture = new Texture({
            url: params.texture,
            parent: this,
        });

        this.texture.load();
    }

    updateHealth(health: number): void {
        this.health = health;

        this.color = this.getColorBasedOnHealth(health);
    }

    getColorBasedOnHealth(health: number): string {
        const colors = [
            'rgba(255, 255, 255, 0.05)', // 0
            'rgba(215, 215, 215, 1)',    // 1
        ];

        return colors[health];
    }

    renderAt(screenReference: ScreenType): void {
        if(this.health > 0) {
            const { context } = screenReference;
            let { x, y, width, height, color } = this;

            context.fillStyle = color;
            context.fillRect(x, y, width, height);

            // temp deprecated
            // this.texture.renderAt(screenReference);
        }
    }
}