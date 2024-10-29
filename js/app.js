document.addEventListener('DOMContentLoaded', () => {
    const Screen = getScreen({
        width: 800,
        height: 500,
        selector: 'div[data-game-id="brick-breaker"] canvas',
        boundaryPadding: 10,
        boundsColor: 'red',
        boundsThickness: 2,
        hideMouse: true,
    });


    const UI = getUI({
        screen: Screen,
    });

    const Game = getGame({
        screen: Screen,
        bricksGridPos: {
            startX: 0 + (Screen.bounds.padding * 8),            // start x
            startY: 0 + (Screen.bounds.padding * 8),            // start y
            endX: Screen.width - (Screen.bounds.padding * 8),   // end x
            endY: 300 + (Screen.bounds.padding * 2)             // end y
        },

        onBrickBreak: (bouncesObject) => {
            UI.items.scores.updateValue(bouncesObject.fromBrick * 10);
        }
    });


    // interactions
    document.body.addEventListener('mousemove', (event) => {
        // limit platform's movement
        if (event.layerX >= 0 && event.layerX <= Screen.width) {
            let { platform, ball } = Game.objects;
            let newX = event.layerX - (platform.width / 2);

            if (newX >= Screen.bounds.left && newX <= Screen.bounds.right - platform.width) {
                platform.x = newX;

                if (ball.isLinkedToPlatform === true) {
                    ball.cx = newX + (platform.width / 2);
                }
            }
        }
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
        UI.render();

        requestAnimationFrame(loop);
    }


    // calling main function using 'requestAnimationFrame()'
    requestAnimationFrame(loop);
});