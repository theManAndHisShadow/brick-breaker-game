import { getRandomFloat } from "../helpers";
import { ScreenType, BallType, BrickType, BrickGridType, GameObjectsType, GameType } from "../global.types";
import Platform from "./Platform";
import Ball from "./Ball";
import Brick from "./Brick";

interface GameParams {
    bricksGridPos: BrickGridType,
    screen: ScreenType,
    onBrickBreak: any,
}

export default class Game implements GameType {
    score: number;
    screen: ScreenType;
    objects: GameObjectsType;
    onBrickBreak: Function;

    constructor(params: GameParams){
        Object.assign(this, params);
        
        const objects: GameObjectsType = {
            platform: new Platform({
                width: 100,
                height: 8,
                x: (params.screen.width / 2) - (100 / 2),
                y: params.screen.height - 69,
                color: 'rgb(115, 115, 115)',
                type: 'platform',
            }),
            ball: new Ball({
                type: 'ball',
                color: 'white',
                x: params.screen.width / 2,
                y: params.screen.height - 75,
                width: 6,
                height: 6,
            }),

            bricks: this.generateBricksGrid(
                params.bricksGridPos.startX,
                params.bricksGridPos.startY,
                params.bricksGridPos.endX,
                params.bricksGridPos.endY,
            ),

            all: [],
        };

        
        objects.all = [objects.platform, objects.ball, ...objects.bricks];

        this.objects = objects;
        this.score = 0;
    }

    protected generateBricksGrid(startX: number, startY: number, endX: number, endY: number, brickSize:number = 20): BrickType[] {
        const offset = 1;
        const columns = Math.floor((endX - startX) / (brickSize + offset));
        const rows = Math.floor((endY - startY) / (brickSize + offset));
        const generatedArray = [];

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                generatedArray.push(new Brick({
                    width: brickSize,
                    height: brickSize,
                    x: startX + i * (brickSize + offset),
                    y: startY + j * (brickSize + offset),
                    color: 'blue',
                    type: 'brick',
                    health: 1,
                }));
            }
        }

        return generatedArray;
    }

    processIntersections(): void {
        const { ball, platform, bricks} = this.objects;
        const { bounds } = this.screen;
        const targets = [platform, ball, ...bricks, this.screen.bounds];

        let ballTop = ball.y - ball.width;
        let ballBottom = ball.y + ball.width;
        let ballLeft = ball.x - ball.width;
        let ballRight = ball.x + ball.width;

        let platformTop = platform.y;
        let platformBottom = platform.y + platform.height;
        let platformLeft = platform.x;
        let platformRight = platform.x + platform.width;

        // Small random angle
        const angleOffset = getRandomFloat(-0.2, 0.2);

        for (let brick of bricks) {
            if (brick.health > 0) {
                const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width));
                const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height));
                const distanceX = ball.x - closestX;
                const distanceY = ball.y - closestY;

                if ((distanceX * distanceX + distanceY * distanceY) <= (ball.width * ball.width)) {
                    brick.color = 'rgba(255, 255, 255, 0.05)';
                    brick.health = 0;

                    // Mirror and add a random angle
                    ball.dx *= -1;

                    // adding zig zag effect when ball bounces from boundary
                    if(ball.bounces.lastBounceFrom !== 'bound') {
                        ball.dy *= -1;
                    }

                    // changeAngle(ball, angleOffset); 
                    ball.bounces.fromBrick += 1;
                    ball.bounces.lastBounceFrom = brick.type;

                    this.onBrickBreak(ball.bounces);
                }
            }
        }

        if (!ball.isLinkedToPlatform) {
            if (ballBottom >= platformTop && ((ballLeft <= platformRight) && (ballRight >= platformLeft))) {
                ball.y = platformTop - ball.width;
                ball.calculateBounceWith(platform);
                ball.calculateAngleChange(angleOffset); // Apply random angle only on platform bounce
                ball.bounces.fromPlatform += 1;
                ball.bounces.lastBounceFrom = platform.type;
            }
        }

        // depending on the bounce location - change the y or x position
        if (ballTop <= bounds.rect.top) ball.y = bounds.rect.top + ball.width;
        if (ballBottom >= bounds.rect.bottom) ball.y = bounds.rect.bottom - ball.width;
        if (ballLeft < bounds.rect.left) ball.x = bounds.rect.left + ball.width;
        if (ballRight >= bounds.rect.right) ball.x = bounds.rect.right - ball.width;

        // implement vertical bounce delta component (y velocity)
        if (ballTop <= bounds.rect.top || ballBottom >= bounds.rect.bottom) ball.dy *= -1;

        // implement horizontal bounce delta component (x velocity)
        if (ballLeft < bounds.rect.left || ballRight >= bounds.rect.right) ball.dx *= -1;

        // If the bounce is from the border - update the counter of bounces from the borders and indicate that the last bounce was from the border
        if (ballTop <= bounds.rect.top || ballBottom >= bounds.rect.bottom || ballLeft < bounds.rect.left || ballRight >= bounds.rect.right) {
            ball.bounces.fromBoundary += 1;
            ball.bounces.lastBounceFrom = 'bound';
        }
    }

    run(): void {
        this.objects.ball.calculateNextPosition();
    }

    render(): void {
        let { context } = this.screen;

        for (let object of this.objects.all) {
            if (object instanceof Brick || object instanceof Platform) {
                let { x, y, width, height, color } = object;
    
                context.fillStyle = color;
                context.fillRect(x, y, width, height);
            } else if(object instanceof Ball) {
                let { x, y, width, color, isLinkedToPlatform } = object as BallType;
    
                context.beginPath();
                context.arc(x, y, width, 0, 2 * Math.PI, false);
                context.fillStyle = isLinkedToPlatform === true ? 'green' : color;
                context.fill();
                context.closePath();

                object.trace.renderAt(this.screen);
            }
        }
    }
}