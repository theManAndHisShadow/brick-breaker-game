import { getRandomFloat } from "./helpers.js";

export function generateBricks (startX, startY, endX, endY, brickSize = 20) {
    const offset = 1;
    const columns = Math.floor((endX - startX) / (brickSize + offset));
    const rows = Math.floor((endY - startY) / (brickSize + offset));
    const generatedArray = [];

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            generatedArray.push({
                width: brickSize,
                height: brickSize,
                x: startX + i * (brickSize + offset),
                y: startY + j * (brickSize + offset),
                shape: 'rect',
                color: 'blue',
                type: 'brick',
                health: 1,
            });
        }
    }
    return generatedArray;
};



export function changeAngle(ball, angleOffset) {
    // Convert the current speed to polar coordinates
    let speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    let angle = Math.atan2(ball.dy, ball.dx);

    // Add a random angle to change direction
    angle += angleOffset;

    // Convert back to Cartesian coordinates
    ball.dx = Math.cos(angle) * speed;
    ball.dy = Math.sin(angle) * speed;
}



export function checkIntersections(ball, platform, bricks, bounds, callbackOnIntersection = () => {}) {
    
    let ballTop = ball.cy - ball.size;
    let ballBottom = ball.cy + ball.size;
    let ballLeft = ball.cx - ball.size;
    let ballRight = ball.cx + ball.size;

    let platformTop = platform.y;
    let platformBottom = platform.y + platform.height;
    let platformLeft = platform.x;
    let platformRight = platform.x + platform.width;

    // Small random angle
    const angleOffset = getRandomFloat(-0.2, 0.2);

    for (let brick of bricks) {
        if (brick.health > 0) {
            const closestX = Math.max(brick.x, Math.min(ball.cx, brick.x + brick.width));
            const closestY = Math.max(brick.y, Math.min(ball.cy, brick.y + brick.height));
            const distanceX = ball.cx - closestX;
            const distanceY = ball.cy - closestY;

            if ((distanceX * distanceX + distanceY * distanceY) <= (ball.size * ball.size)) {
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
            ball.cy = platformTop - ball.size;
            calculateBounce(ball, platform);
            changeAngle(ball, angleOffset); // Apply random angle only on platform bounce
            ball.bounces.fromPlatform += 1;
            ball.bounces.lastBounceFrom = platform.type;
        }
    }

    // depending on the bounce location - change the y or x position
    if (ballTop <= bounds.top) ball.cy = bounds.top + ball.size;
    if (ballBottom >= bounds.bottom) ball.cy = bounds.bottom - ball.size;
    if (ballLeft < bounds.left) ball.cx = bounds.left + ball.size;
    if (ballRight >= bounds.right) ball.cx = bounds.right - ball.size;

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



export function calculateBounce (ball, platform) {
    const platformCenterX = platform.x + (platform.width / 2);
    const offsetX = ball.cx - platformCenterX;
    const platformHalfWidth = platform.width / 2;
    const relativeIntersectX = offsetX / platformHalfWidth;

    const maxBounceAngle = Math.PI / 3; // limit the deviation angle
    const bounceAngle = relativeIntersectX * maxBounceAngle;

    const ballSpeed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);

    ball.dx = ballSpeed * Math.sin(bounceAngle);
    ball.dy = -ballSpeed * Math.cos(bounceAngle);
};

    

export function calcBallNextPos (ball) {
    let { dx, dy } = ball;

    if (dx !== 0 || dy !== 0) {
        // updating pos of ball
        ball.cx += dx;
        ball.cy += dy;
    }
}