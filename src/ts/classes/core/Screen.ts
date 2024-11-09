import { ScreenType, BoundsType, CRTFilterType } from "../../global.types";
import CRTFilter from "../fx/CRTFilter";
import { changeColorOpacity } from "../../helpers";

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
    filter: CRTFilterType;
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

        this.filter = new CRTFilter({
            width: params.width,
            height: params.height,
            lineHeight: 1,
            lineSpacing: 2,
            lineColor: 'rgba(0, 0, 0, 0.25)'
        });
    }

    clear(): void {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    drawBackground(): void {
        const { context } = this;
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = this.width / 2;
        
        context.fillStyle = this.background;
        context.fillRect(0, 0, this.width, this.height);

        // Create a radial gradient for the gray spot
        const gradient = context.createRadialGradient(centerX, centerY, radius * 0.1, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(150, 100, 100, 0.14)');   
        gradient.addColorStop(1, 'rgba(120, 120, 120, 0)');     

        // Draw a circle with a gradient
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        context.fill();

    }

    renderCrtFilter(){
        this.context.drawImage(this.filter.layer, 0, 0);
    }

    drawBoundary(neonStyle: boolean): void {
        const { bounds } = this;

        if(neonStyle === true) {
            let gainedColor = changeColorOpacity(this.bounds.color, 1);
            this.context.shadowBlur = 130;
            this.context.shadowColor = gainedColor;
        }

        this.context.strokeStyle = this.bounds.color;
        this.context.lineWidth = this.bounds.thickness;
        this.context.strokeRect(bounds.rect.left, bounds.rect.top, bounds.rect.right - bounds.padding, bounds.rect.bottom - bounds.padding);
    }
}