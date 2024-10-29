function generateBricks (startX, startY, endX, endY, brickSize = 20) {
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



function checkIntersections (ball, platform, bricks, bounds) {
    let ballTop = ball.cy - ball.size;
    let ballBottom = ball.cy + ball.size
    let ballLeft = ball.cx - ball.size;
    let ballRight = ball.cx + ball.size;

    let platformTop = platform.y;
    let platformBottom = platform.y + platform.height;
    let platformLeft = platform.x;
    let platfromRight = platform.x + platform.width;


    for (let brick of bricks) {
        if (brick.health > 0) {
            // Determine the closest point to the center of the ball on the brick
            const closestX = Math.max(brick.x, Math.min(ball.cx, brick.x + brick.width));
            const closestY = Math.max(brick.y, Math.min(ball.cy, brick.y + brick.height));

            // Calculate the distance between the center of the ball and the closest point on the brick
            const distanceX = ball.cx - closestX;
            const distanceY = ball.cy - closestY;

            if ((distanceX * distanceX + distanceY * distanceY) <= (ball.size * ball.size)) {
                brick.color = 'rgba(255, 255, 255, 0.05)';
                brick.health = 0;

                // Update the properties of the ball
                ball.dx *= -1;
                ball.dy *= -1;
                ball.bounces.fromBrick += 1;

                // console.log(game.objects.ball.bounces.fromBrick);
            }
        }
    }

    if (ball.isLinkedToPlatform === false) {
        if (ballBottom >= platformTop && ((ballLeft <= platfromRight) && (ballRight >= platformLeft))) {
            ball.cy = platformTop - ball.size;
            calculateBounce(ball, platform);
            ball.bounces.fromPlatform += 1;
        }
    }

    if (ballTop <= bounds.top) {
        ball.dy *= -1;
        ball.cy = bounds.top + ball.size;
        ball.bounces.fromBoundary += 1;
    }

    if (ballBottom >= bounds.bottom) {
        ball.dy *= -1;
        ball.cy = bounds.bottom - ball.size;
        ball.bounces.fromBoundary += 1;
        // The game may end or the ball position may reset
        // add some logic later
    }

    if (ballLeft < bounds.left) {
        ball.dx *= -1;
        ball.cx = bounds.left + ball.size;
        ball.bounces.fromBoundary += 1;
    }

    if (ballRight >= bounds.right) {
        ball.dx *= -1;
        ball.cx = bounds.right - ball.size;
        ball.bounces.fromBoundary += 1;
    }
};



function calculateBounce (ball, platform) {
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

    

function calcBallNextPos (ball) {
    let { dx, dy } = ball;

    if (dx !== 0 || dy !== 0) {
        // updating pos of ball
        ball.cx += dx;
        ball.cy += dy;
    }
}