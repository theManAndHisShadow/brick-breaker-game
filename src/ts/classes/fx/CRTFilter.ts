import { CRTFilterType } from "../../global.types";

interface CRTFilterParams {
    width: number,
    height: number,
    lineHeight: number,
    lineSpacing: number,
    lineColor: string,
}

export default class CRTFilter implements CRTFilterType {
    width: number;
    height: number;
    lineHeight: number;
    lineSpacing: number;
    lineColor: string;
    layer: HTMLCanvasElement;

    constructor(params: CRTFilterParams){
        Object.assign(this, params);

        const srtFilterCanvas: HTMLCanvasElement = document.createElement('canvas');
              srtFilterCanvas.width = params.width;
              srtFilterCanvas.height = params.height;

        this.layer = srtFilterCanvas;

        // fill layer with crt lines
        this.drawLayer();
    }

    private drawLayer(): void{
        const context = this.layer.getContext('2d');
        context.fillStyle = this.lineColor;

        for (let y = 0; y < this.height; y += this.lineSpacing) {
            context.fillRect(0, y, this.width, this.lineHeight);
        }
    }
}