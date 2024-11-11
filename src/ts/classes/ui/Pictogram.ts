import { PictogramType, ScreenType, TextureType } from "../../global.types";
import Texture from "../core/Texture";

interface PictogramParamsType {
    x: number,
    y: number,
    width: number,
    height: number,
    texture: string;
}

export default class Pictogram implements PictogramType {
    x: number;
    y: number;
    width: number;
    height: number;
    texture: TextureType;

    constructor(params: PictogramParamsType){
        Object.assign(this, params);

        this.texture = new Texture({
            url: params.texture,
            parent: this,
        });
    }

    renderAt(screenReference: ScreenType): void {
        this.texture.renderAt(screenReference);
    }
}