import { BallType, BrickType, PlatformType, PrimitiveType, ScreenType, TextureType } from "../../global.types";

interface TextureParams {
    url: string,
    parent: PrimitiveType | BallType | BrickType | PlatformType,
}

export default class Texture implements TextureType {
    loaded: boolean;
    texture: HTMLImageElement;
    url: string;
    parent: PrimitiveType | BallType | BrickType | PlatformType;

    constructor(params: TextureParams){
        Object.assign(this, params);

        this.load();
    }

    load(): void {
        const texture = new Image();
        texture.src = this.url;

        // on texture load - set status of loading and save texture for future using
        texture.onload = () => {
            this.texture = texture;
            this.loaded = true;
        };
    }

    renderAt(screenReference: ScreenType): void {
        // if texture already loaded - use it again
        if(this.loaded === true) {
            const { context } = screenReference;

            try {
                context.drawImage(this.texture, this.parent.x, this.parent.y, this.parent.width, this.parent.height);
            } catch (error) {
                console.error("catched error! " + error);
            }
        }
    }
}