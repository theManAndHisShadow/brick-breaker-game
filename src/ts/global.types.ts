export interface PrimitiveType {
    width: number,
    height: number,
    x: number,
    y: number,
    color?: string,
    
    renderAt(screenReference: ScreenType): void,
};

export interface TextureType {
    loaded: boolean,
    texture: HTMLImageElement,
    url: string,
    parent: PrimitiveType | BallType | BrickType | PlatformType,
    load(): void,
    renderAt(screenReference: ScreenType): void,
}

export interface CRTFilterType {
    width: number,
    height: number,
    lineHeight: number,
    lineSpacing: number,
    lineColor: string,
    layer: HTMLCanvasElement,
}

export interface PrimitiveParams {
    width: number;
    height: number;
    x: number;
    y: number;
    color: string;
}

export interface BounceStatisticsType {
    lastBounceFrom: boolean | string,
    fromBrick: number,
    fromPlatform: number,
    fromBoundary: number,
}

export interface TracerItem {
    x: number,
    y: number,
};

export interface TracerType {
    memoryLimit: number,
    trainType: string,
    color: string,
    getLastPoint(): TracerItem | boolean,
    getlength(): number,
    add(point: TracerItem): void,
    renderAt(screenReference: ScreenType): void,
}

export interface BallType extends PrimitiveType {
    dx: number,
    dy: number,
    angle: number,
    isLinkedToPlatform: boolean,
    isWaitingStart: boolean,
    bounces: BounceStatisticsType,
    trace: TracerType,
    calculateAngleChange(angleOffset: number): void,
    calculateBounceWith(bounceTarget: PlatformType | BrickType): void,
    calculateNextPosition(): void,
};

export interface PlatformType extends PrimitiveType {};

export interface BrickType extends PrimitiveType {
    health: number,
    texture: TextureType,
    getColorBasedOnHealth(health: number): string,
    updateHealth(health: number): void,
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
    neonStyle: boolean,
    run(): void,
    processIntersections(): void,
    render (): void,
};

export interface ScreenType {
    body: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    filter: CRTFilterType,
    width: number,
    height: number,
    bounds: BoundsType,
    background: 'black' | string,
    clear():void,
    drawBackground(): void,
    drawBoundary(): void,
    renderCrtFilter(): void,
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