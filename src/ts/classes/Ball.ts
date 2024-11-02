import Primitive from "./Primitive";
import { BounceStatisticsType, BallType, PlatformType, BrickType } from "../global.types";

interface BallParams {
    width: number,
    height: number,
    color: string,
    x: number,
    y: number,
    type: string,
}

export default class Ball extends Primitive implements BallType {
    dx: number;
    dy: number;
    angle: number;
    isLinkedToPlatform: boolean;
    isWaitingStart: boolean;
    bounces: BounceStatisticsType;

    constructor(params: BallParams){
        const defaultParams = {
                type: 'ball',
                dx: 0,
                dy: 0,
                angle: 90,
                isLinkedToPlatform: true,
                isWaitingStart: true,
                bounces: {
                    lastBounceFrom: 0,
                    fromBrick: 0,
                    fromPlatform: 0,
                    fromBoundary: 0,
                },
        };

        // merging default ball params and external passed params
        params = {...params, ...defaultParams};

        // extending some values from parent class
        super(params);
        
        // fill new instance structure
        Object.assign(this, params);
    }

    calculateAngleChange(angleOffset: number): void {
        // Convert the current speed to polar coordinates
        let speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        let angle = Math.atan2(this.dy, this.dx);

        // Add a random angle to change direction
        angle += angleOffset;

        // Convert back to Cartesian coordinates
        this.dx = Math.cos(angle) * speed;
        this.dy = Math.sin(angle) * speed;
    }

    calculateBounceWith(bounceTarget: PlatformType | BrickType): void {
        const targetCenterX = bounceTarget.x + (bounceTarget.width / 2);
        const offsetX = this.x - targetCenterX;
        const targetHalfWidth = bounceTarget.width / 2;
        const relativeIntersectX = offsetX / targetHalfWidth;

        const maxBounceAngle = Math.PI / 3; // limit the deviation angle
        const bounceAngle = relativeIntersectX * maxBounceAngle;

        const ballSpeed = Math.sqrt(this.dx ** 2 + this.dy ** 2);

        this.dx = ballSpeed * Math.sin(bounceAngle);
        this.dy = -ballSpeed * Math.cos(bounceAngle);
    }

    calculateNextPosition(): void {
        let { dx, dy } = this;

        if (dx !== 0 || dy !== 0) {
            // updating pos of ball
            this.x += dx;
            this.y += dy;
        }
    }
}