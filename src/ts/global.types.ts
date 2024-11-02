export interface PrimitiveType {
    width: number,
    height: number,
    x: number,
    y: number,
    type: string,
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
    calculateAngleChange(angleOffset: number): void,
    calculateBounceWith(bounceTarget: PlatformType | BrickType): void,
    calculateNextPosition(): void;
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
    color: string,
    thickness: number,
    rect: {
        top: number
        left: number,
        right: number,
        bottom: number,
    },
};

export interface GameObjectsType {
    platform: PlatformType,
    ball: BallType,
    bricks: BrickType[],
    all: (PlatformType | BallType | BrickType)[],
}

export interface GameType {
    score: number,
    screen: ScreenType,
    objects: GameObjectsType,
    onBrickBreak: Function,
    run(): void,
    processIntersections(): void,
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

export interface UIElementType {
    id: string,
    label: string,
    rect: UIElementBoundingRectType,
    value: any,
    fontSize: number,          
    fontName: string, 
    lineSpacing: number,        
    labelColor: string,   
    valueColor: string,   
    updateValue(newVale: any): void,
    render(): void,
};

export interface UIType {
    items: UIElementType[],
    screen: ScreenType,
    createElement({id, label, x, y}: {id: string, label: string, x: number, y: number}): UIElementType
    getElementById(id: string): UIElementType,
    render(): void,
};