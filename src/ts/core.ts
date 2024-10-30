import { getRandomFloat } from "./helpers";
import { BallType, BoundsType, BrickType, PlatformType, BounceStatisticsType } from "./global.types";
import Brick from "./classes/Brick";

export function generateBricks (startX: number, startY: number, endX: number, endY: number, brickSize:number = 20): BrickType[] {
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
};



export function changeAngle(ball: BallType, angleOffset: number) {
    // Convert the current speed to polar coordinates
    let speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    let angle = Math.atan2(ball.dy, ball.dx);

    // Add a random angle to change direction
    angle += angleOffset;

    // Convert back to Cartesian coordinates
    ball.dx = Math.cos(angle) * speed;
    ball.dy = Math.sin(angle) * speed;
}



export function checkIntersections(ball: BallType, platform: PlatformType, bricks: BrickType[], bounds: BoundsType, callbackOnIntersection = (bounces: BounceStatisticsType) => {}) {
    
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

                callbackOnIntersection(ball.bounces);
            }
        }
    }

    if (!ball.isLinkedToPlatform) {
        if (ballBottom >= platformTop && ((ballLeft <= platformRight) && (ballRight >= platformLeft))) {
            ball.y = platformTop - ball.width;
            calculateBounce(ball, platform);
            changeAngle(ball, angleOffset); // Apply random angle only on platform bounce
            ball.bounces.fromPlatform += 1;
            ball.bounces.lastBounceFrom = platform.type;
        }
    }

    // depending on the bounce location - change the y or x position
    if (ballTop <= bounds.top) ball.y = bounds.top + ball.width;
    if (ballBottom >= bounds.bottom) ball.y = bounds.bottom - ball.width;
    if (ballLeft < bounds.left) ball.x = bounds.left + ball.width;
    if (ballRight >= bounds.right) ball.x = bounds.right - ball.width;

    // implement vertical bounce delta component (y velocity)
    if (ballTop <= bounds.top || ballBottom >= bounds.bottom) ball.dy *= -1;

    // implement horizontal bounce delta component (x velocity)
    if (ballLeft < bounds.left || ballRight >= bounds.right) ball.dx *= -1;

    // If the bounce is from the border - update the counter of bounces from the borders and indicate that the last bounce was from the border
    if (ballTop <= bounds.top || ballBottom >= bounds.bottom || ballLeft < bounds.left || ballRight >= bounds.right) {
        ball.bounces.fromBoundary += 1;
        ball.bounces.lastBounceFrom = 'bound';
    }

}



export function calculateBounce (ball: BallType, platform: PlatformType) {
    const platformCenterX = platform.x + (platform.width / 2);
    const offsetX = ball.x - platformCenterX;
    const platformHalfWidth = platform.width / 2;
    const relativeIntersectX = offsetX / platformHalfWidth;

    const maxBounceAngle = Math.PI / 3; // limit the deviation angle
    const bounceAngle = relativeIntersectX * maxBounceAngle;

    const ballSpeed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);

    ball.dx = ballSpeed * Math.sin(bounceAngle);
    ball.dy = -ballSpeed * Math.cos(bounceAngle);
};

    

export function calcBallNextPos (ball: BallType) {
    let { dx, dy } = ball;

    if (dx !== 0 || dy !== 0) {
        // updating pos of ball
        ball.x += dx;
        ball.y += dy;
    }
}