export interface PrimitiveObject {
    width: number,
    height: number,
    x: number,
    y: number,
    type: string,
    shape: string,
    color: string,
};

export interface BounceStatistics {
    lastBounceFrom: boolean | string,
    fromBrick: number,
    fromPlatform: number,
    fromBoundary: number,
}

export interface Ball extends PrimitiveObject {
    dx: number,
    dy: number,
    angle: number,
    isLinkedToPlatform: boolean,
    isWaitingStart: boolean,
    bounces: BounceStatistics,
};

export interface Platform extends PrimitiveObject {};

export interface Brick extends PrimitiveObject {
    health: number,
};

export interface BrickGrid {
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number
}

export interface Bounds {
    padding: number,
    top: number
    left: number,
    right: number,
    bottom: number,
};

export interface GameObjects {
    platform: Platform,
    ball: Ball,
    bricks: Brick[],
    all: (Platform | Ball | Brick)[],
}

export interface Game {
    score: number,
    objects: GameObjects,
    render (): void,
};

export interface Screen {
    body: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    bounds: Bounds,
    background: 'black' | string,
    clear():void,
    drawBackground(): void,
    drawBoundary(): void,
};


export interface UIElementBoundingRect {
    topLeft:     {x: number, y: number},
    bottomLeft:  {x: number, y: number},
    topRight:    {x: number, y: number},
    bottomRight: {x: number, y: number},
};

export interface UIElement {
    id: string,
    label: string,
    rect: UIElementBoundingRect,
    value: any,
    updateValue(newVale: any): void,
    render(): void,
};

export interface UI {
    items: UIElement[],
    getElementById(id: string): UIElement,
    render(): void,
};