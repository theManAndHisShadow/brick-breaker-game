export interface PrimitiveType {
    width: number,
    height: number,
    x: number,
    y: number,
    type: string,
    shape: string,
    color: string,
};

export interface BounceStatisticsType {
    lastBounceFrom: boolean | string,
    fromBrick: number,
    fromPlatform: number,
    fromBoundary: number,
}

export interface BallType extends PrimitiveType {
    dx: number,
    dy: number,
    angle: number,
    isLinkedToPlatform: boolean,
    isWaitingStart: boolean,
    bounces: BounceStatisticsType,
};

export interface PlatformType extends PrimitiveType {};

export interface BrickType extends PrimitiveType {
    health: number,
};

export interface BrickGridType {
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number
}

export interface BoundsType {
    padding: number,
    top: number
    left: number,
    right: number,
    bottom: number,
};

export interface GameObjectsType {
    platform: PlatformType,
    ball: BallType,
    bricks: BrickType[],
    all: (PlatformType | BallType | BrickType)[],
}

export interface GameType {
    score: number,
    objects: GameObjectsType,
    render (): void,
};

export interface ScreenType {
    body: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    bounds: BoundsType,
    background: 'black' | string,
    clear():void,
    drawBackground(): void,
    drawBoundary(): void,
};


export interface UIElementBoundingRectType {
    topLeft:     {x: number, y: number},
    bottomLeft:  {x: number, y: number},
    topRight:    {x: number, y: number},
    bottomRight: {x: number, y: number},
};

export interface UIElement {
    id: string,
    label: string,
    rect: UIElementBoundingRectType,
    value: any,
    updateValue(newVale: any): void,
    render(): void,
};

export interface UIType {
    items: UIElement[],
    getElementById(id: string): UIElement,
    render(): void,
};