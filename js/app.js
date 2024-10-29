document.addEventListener('DOMContentLoaded', () => {
    const Screen = getScreen({
        width: 800,
        height: 500,
        selector: 'div[data-game-id="brick-breaker"] canvas',
        boundaryPadding: 10,
        boundsColor: 'red',
        boundsThickness: 2,
    });

    // stortage place
    const game = {
        score: 0,

        objects: {
            platform: {
                width: 100,
                height: 8,
                x: (Screen.width / 2) - (100 / 2),
                y: Screen.height - 69,
                shape: 'rect',
                color: 'rgb(115, 115, 115)',
                type: 'platform',
            },
            ball: {
                type: 'ball',
                color: 'white',
                shape: 'circle',
                cx: Screen.width / 2,
                cy: Screen.height - 75,
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
                0 + (Screen.bounds.padding * 4),       // start x
                0 + (Screen.bounds.padding * 4),       // start y
                Screen.width - (Screen.bounds.padding * 4),   // end x
                300 + (Screen.bounds.padding * 1)      // end y
            ),

            all: [],
        },
    };

    // link special 'all' value
    game.objects.all = [game.objects.platform, game.objects.ball, ...game.objects.bricks];


    // interactions
    Screen.body.addEventListener('mousemove', (event) => {
        if (event.layerX >= 0 && event.layerX <= Screen.width) {
            let { platform, ball } = game.objects;

            let newX = event.layerX - (platform.width / 2);

            if (newX >= Screen.bounds.left && newX <= Screen.bounds.right - platform.width) {
                platform.x = newX;

                if (ball.isLinkedToPlatform === true) {
                    ball.cx = newX + (platform.width / 2);
                }
            }
        } else {
            console.log('Mouse is out of bounds!');
        }
    });

    Screen.body.addEventListener('mouseenter', () => {
        Screen.body.style.cursor = 'none';
    });

    Screen.body.addEventListener('mouseover', () => {
        Screen.body.style.cursor = 'initial';
    });


    Screen.body.addEventListener('click', () => {
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
        // Screen.clear();
        Screen.drawBackground();
        drawGameFrame(Screen, game);
        Screen.drawBoundary();

        requestAnimationFrame(loop);
    }

    console.log(Screen);


    // calling main function using 'requestAnimationFrame()'
    requestAnimationFrame(loop);
});