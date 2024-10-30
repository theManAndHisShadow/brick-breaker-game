import Ball from "./classes/Ball";
import Brick from "./classes/Brick";
import Platform from "./classes/Platform";
import { generateBricks, checkIntersections, calcBallNextPos } from "./core";
import { BallType, BrickGridType, GameType, GameObjectsType, ScreenType } from "./global.types.js";

interface GameParams {
    bricksGridPos: BrickGridType,
    screen: ScreenType,
    onBrickBreak: any,
}

export default function getGame(params: GameParams){
    let score = 0;
    
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
            dx: 0,
            dy: 0,
            width: 6,
            height: 6,
            angle: 90,
            isLinkedToPlatform: true,
            isWaitingStart: true,
            bounces: {
                lastBounceFrom: null,
                fromBrick: 0,
                fromPlatform: 0,
                fromBoundary: 0,
            },
        }),

        bricks: generateBricks(
            params.bricksGridPos.startX,
            params.bricksGridPos.startY,
            params.bricksGridPos.endX,
            params.bricksGridPos.endY,
        ),

        all: [],
    };

    
    objects.all = [objects.platform, objects.ball, ...objects.bricks];

    const GameObject: GameType = {
        score: score,
        objects: objects,
        render: () => {
            const { context } = params.screen;

            // intersections
            checkIntersections(objects.ball, objects.platform, objects.bricks, params.screen.bounds, params.onBrickBreak);
        
            // ball movements
            calcBallNextPos(objects.ball);
        
            for (let object of objects.all) {
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
                }
            }
        },
    }

    return GameObject;
}