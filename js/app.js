document.addEventListener('DOMContentLoaded', () => {
    // basic preparations
    const width = 800;
    const height = 500;
    const bgColor = 'rgba(0, 0, 0, 1)';

    let canvas = document.querySelector('div[data-game-id="brick-breaker"] canvas');
    canvas.width = width;
    canvas.height = height;

    let context = canvas.getContext('2d');
    const drawBG = () => {
        context.fillStyle = bgColor;
        context.fillRect(0, 0, width, height);
    }

    const generateBricks = (startX, startY, endX, endY, brickSize = 20) => {
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

    const getRandomNumInRange = (from, to) => {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    const calculateBounce = (ball, platform) => {
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


    const checkIntersections = () => {
        let ball = game.objects.ball;
        let ballTop = ball.cy - ball.size;
        let ballBottom = ball.cy + ball.size
        let ballLeft = ball.cx - ball.size;
        let ballRight = ball.cx + ball.size;

        let platform = game.objects.player;
        let platformTop = platform.y;
        let platformBottom = platform.y + platform.height;
        let platformLeft = platform.x;
        let platfromRight = platform.x + platform.width;


        for (let brick of game.objects.bricks) {
            if (brick.health > 0) {
                let brickTop = brick.y;
                let brickBottom = brick.y + brick.height;
                let brickLeft = brick.x;
                let brickRight = brick.x + brick.width;

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

        if (ballTop <= game.bounds.top) {
            ball.dy *= -1;
            ball.cy = game.bounds.top + ball.size;
        }

        if (ballBottom >= game.bounds.bottom) {
            ball.dy *= -1;
            ball.cy = game.bounds.bottom - ball.size;
            // The game may end or the ball position may reset
            // add some logic later
        }

        if (ballLeft < game.bounds.left) {
            ball.dx *= -1;
            ball.cx = game.bounds.left + ball.size;
        }

        if (ballRight >= game.bounds.right) {
            ball.dx *= -1;
            ball.cx = game.bounds.right - ball.size;
        }
    };

    const normalizeToRange = (value, originalMin, originalMax, targetMin, targetMax) => {
        return ((value - originalMin) * (targetMax - targetMin)) / (originalMax - originalMin) + targetMin;
    };



    const calcBallNextPos = (ball) => {
        let { angle, dx, dy } = ball;

        if (dx !== 0 || dy !== 0) {
            // updating pos of ball
            ball.cx += dx;
            ball.cy += dy;
        }
    }

    const boundingRectMargin = 10;
    const boundingRectThickness = 2;
    const boundingRectOffset = boundingRectMargin + boundingRectMargin;
    const boundingRectColor = 'red';

    // stortage place
    const game = {
        bounds: {
            left: 0 + boundingRectOffset,
            right: width - boundingRectOffset,
            top: 0 + boundingRectOffset,
            bottom: height - boundingRectOffset,
        },

        objects: {
            player: {
                width: 100,
                height: 8,
                x: (width / 2) - (100 / 2),
                y: height - 69,
                shape: 'rect',
                color: 'rgb(115, 115, 115)',
                type: 'player',
            },
            ball: {
                type: 'ball',
                color: 'white',
                shape: 'circle',
                cx: width / 2,
                cy: height - 75,
                dx: 0,
                dy: 0,
                size: 6,
                angle: 90,
                speed: 0,
                isLinkedToPlatform: true,
                isWaitingStart: true,
                bounces: {
                    fromBrick: 0,
                    fromPlatform: 0,
                },
            },

            bricks: generateBricks(
                0 + (boundingRectOffset * 4),       // start x
                0 + (boundingRectOffset * 4),       // start y
                width - (boundingRectOffset * 4),   // end x
                300 + (boundingRectOffset * 1)      // end y
            ),

            all: [],
        },
    };

    game.objects.all = [game.objects.player, game.objects.ball, ...game.objects.bricks];

    canvas.addEventListener('mousemove', (event) => {
        if (event.layerX >= 0 && event.layerX <= width) {
            let { player, ball } = game.objects;

            let newX = event.layerX - (player.width / 2);

            if (newX >= game.bounds.left && newX <= game.bounds.right - player.width) {
                player.x = newX;

                if (ball.isLinkedToPlatform === true) {
                    ball.cx = newX + (player.width / 2);
                }
            }
        } else {
            console.log('Mouse is out of bounds!');
        }
    });

    canvas.addEventListener('mouseenter', () => {
        canvas.style.cursor = 'none';
    });

    canvas.addEventListener('mouseover', () => {
        canvas.style.cursor = 'initial';
    });


    canvas.addEventListener('click', () => {
        if (game.objects.ball.isWaitingStart === true) {
            const { ball } = game.objects;
            ball.isWaitingStart = false;
            ball.isLinkedToPlatform = false;

            // Setting the initial speed and angle
            const initialSpeed = 4;
            ball.dx = initialSpeed * Math.cos(ball.angle);
            ball.dy = -initialSpeed * Math.sin(ball.angle);
        }
    });

    // main function
    const loop = () => {
        context.clearRect(0, 0, width, height);
        drawBG();

        // intersections
        checkIntersections();

        // ball movements
        calcBallNextPos(game.objects.ball);

        for (let gameObject of game.objects.all) {
            let { shape } = gameObject;

            if (shape === 'rect') {
                let { x, y, width, height, type, color } = gameObject;

                context.fillStyle = color;
                context.fillRect(x, y, width, height);
            } else if (shape === 'circle') {
                let { cx, cy, size, color, type, isLinkedToPlatform } = gameObject;

                context.beginPath();
                context.arc(cx, cy, size, 0, 2 * Math.PI, false);
                context.fillStyle = isLinkedToPlatform === true ? 'green' : color;
                context.fill();
                context.closePath();
            }
        }

        context.strokeStyle = boundingRectColor;
        context.lineWidth = boundingRectThickness;
        context.strokeRect(game.bounds.left, game.bounds.top, game.bounds.right - boundingRectOffset, game.bounds.bottom - boundingRectOffset);

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    console.log(canvas, context);
});