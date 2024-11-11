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

export interface GameEventData {
    [key: string]: any;
}

export interface GameEventStorage {
    [key: string]: Array<(data: GameEventData) => void>;
}

export interface GameEventTargetType {
    events: GameEventStorage,
    addEventListener(eventName: string, callback: (data: GameEventData) => void): void,
    dispatchEvent(eventName: string, data: GameEventData): void,
}

export interface GameType extends GameEventTargetType {
    score: number,
    screen: ScreenType,
    objects: GameObjectsType,
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
    drawBoundary(neonStyle: boolean): void,
    renderCrtFilter(): void,
};

export interface PictogramType {
    x: number,
    y: number,
    width: number,
    height: number,
    texture: TextureType,
    renderAt(screenReference: ScreenType): void,
}

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
    value: number | string | boolean | PictogramType | PictogramType[],
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
    createElement({id, label, x, y, value, valueColor}: {id: string, label: string, x: number, y: number, value?: number | string | boolean | PictogramType | PictogramType[], valueColor?: string}): UIElementType
    getElementById(id: string): UIElementType,
    render(): void,
};

export interface SoundStorage {
    [key: string]: AudioBuffer,
}

export interface SoundComposerType {
    context: AudioContext,
    sfx: SoundStorage,
    music: SoundStorage,
    loadFile({filename, type, name}: {filename: string, type: string, name: string}): void,
    play(type: string, name: string, gain: number): void,
}