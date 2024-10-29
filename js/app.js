document.addEventListener('DOMContentLoaded', () => {
    const Screen = getScreen({
        width: 800,
        height: 500,
        selector: 'div[data-game-id="brick-breaker"] canvas',
        boundaryPadding: 10,
        boundsColor: 'red',
        boundsThickness: 2,
    });

    const Game = getGame({
        screen: Screen,
        bricksGridPos: {
            startX: 0 + (Screen.bounds.padding * 4),            // start x
            startY: 0 + (Screen.bounds.padding * 4),            // start y
            endX: Screen.width - (Screen.bounds.padding * 4),   // end x
            endY: 300 + (Screen.bounds.padding * 1)             // end y
        }
    });


    // interactions
    Screen.body.addEventListener('mousemove', (event) => {
        if (event.layerX >= 0 && event.layerX <= Screen.width) {
            let { platform, ball } = Game.objects;

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
        if (Game.objects.ball.isWaitingStart === true) {
            const { ball } = Game.objects;
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
        Screen.drawBoundary();

        Game.render();

        requestAnimationFrame(loop);
    }


    // calling main function using 'requestAnimationFrame()'
    requestAnimationFrame(loop);
});