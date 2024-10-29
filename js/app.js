document.addEventListener('DOMContentLoaded', () => {
    // basic preparations
    const width = 800;
    const height = 500;
    const bgColor = 'rgba(0, 0, 0, 1)';

    let canvas = document.querySelector('div[data-game-id="brick-breaker"] canvas');
    canvas.width = width;
    canvas.height = height;

    let context = canvas.getContext('2d');



    // main functions
    const drawBG = () => {
        context.fillStyle = bgColor;
        context.fillRect(0, 0, width, height);
    }


    // some game settings
    const boundingRectMargin = 10;
    const boundingRectThickness = 2;
    const boundingRectOffset = boundingRectMargin + boundingRectMargin;
    const boundingRectColor = 'red';

    // stortage place
    const game = {
        score: 0,
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
                    fromBoundary: 0,
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

    // link special 'all' value
    game.objects.all = [game.objects.player, game.objects.ball, ...game.objects.bricks];


    // interactions
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

        drawGameFrame(context, game);

        context.strokeStyle = boundingRectColor;
        context.lineWidth = boundingRectThickness;
        context.strokeRect(game.bounds.left, game.bounds.top, game.bounds.right - boundingRectOffset, game.bounds.bottom - boundingRectOffset);

        requestAnimationFrame(loop);
    }


    // calling main function using 'requestAnimationFrame()'
    requestAnimationFrame(loop);
});