export interface GameObject {
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

export interface Ball extends GameObject {
    dx: number,
    dy: number,
    angle: number,
    isLinkedToPlatform: boolean,
    isWaitingStart: boolean,
    bounces: BounceStatistics,
};

export interface Platform extends GameObject {};

export interface Brick extends GameObject {
    health: number,
};

export interface Bounds {
    padding: number,
    top: number
    left: number,
    right: number,
    bottom: number,
};