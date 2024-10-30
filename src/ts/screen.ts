import { ScreenType, BoundsType } from "./global.types"

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

export default function getScreen(params: ScreenParams) {
    const canvas: HTMLCanvasElement = document.querySelector(params.selector);
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    const boundsObject: BoundsType = {
        padding: params.boundaryPadding,

        left: 0 + params.boundaryPadding,
        right: params.width - params.boundaryPadding,
        top: 0 + params.boundaryPadding,
        bottom: params.height - params.boundaryPadding,
    }

    // set canvas sizes
    canvas.width = params.width;
    canvas.height = params.height;

    if(params.hideMouse) {
        canvas.addEventListener('mouseenter', () => {
            canvas.style.cursor = 'none';
        });

        canvas.addEventListener('mouseover', () => {
            canvas.style.cursor = 'initial';
        });
    }

    const ScreenObject: ScreenType = {
        body: canvas,
        context: context,
        width: params.width,
        height: params.height,
        background: params.background,
        bounds: boundsObject,

        clear: () => {
            context.clearRect(0, 0, params.width, params.height);
        },

        drawBackground: () => {
            context.fillStyle = params.background;
            context.fillRect(0, 0, params.width, params.height);
        },

        drawBoundary: () => {
            context.strokeStyle = params.boundsColor;
            context.lineWidth = params.boundsThickness;
            context.strokeRect(boundsObject.left, boundsObject.top, boundsObject.right - params.boundaryPadding, boundsObject.bottom - params.boundaryPadding);
        },
    }

    return ScreenObject;
}