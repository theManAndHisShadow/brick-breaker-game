import { ScreenType, BoundsType } from "../global.types";

interface ScreenParams {
    width: number, 
    height: number, 
    background: string,
    hideMouse: true | boolean, 
    selector: string,  
    boundaryPadding: 0 | number, 
    boundsColor: string,
    boundsThickness: number,
};

export default class Screen implements ScreenType {
    body: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    bounds: BoundsType;
    background: 'black' | string;

    constructor(params: ScreenParams) {
        const boundsObject: BoundsType = {
            color: params.boundsColor,
            thickness: params.boundsThickness,
            padding: params.boundaryPadding,
            rect: {
                left: 0 + params.boundaryPadding,
                right: params.width - params.boundaryPadding,
                top: 0 + params.boundaryPadding,
                bottom: params.height - params.boundaryPadding,
            },
        }

        const canvas: HTMLCanvasElement = document.querySelector(params.selector);
        const context: CanvasRenderingContext2D = canvas.getContext('2d');

        // set canvas sizes
        canvas.width = params.width;
        canvas.height = params.height;
        
        this.body = canvas;
        this.context = context;
        this.bounds = boundsObject;

        this.width = params.width;
        this.height = params.height;
        this.background = params.background;
    }

    clear(): void {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    drawBackground(): void {
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    drawBoundary(): void {
        const { bounds } = this;

        this.context.strokeStyle = this.bounds.color;
        this.context.lineWidth = this.bounds.thickness;
        this.context.strokeRect(bounds.rect.left, bounds.rect.top, bounds.rect.right - bounds.padding, bounds.rect.bottom - bounds.padding);
    }
}