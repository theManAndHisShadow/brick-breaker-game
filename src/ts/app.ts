import { ScreenType, UIType, GameType, BounceStatisticsType } from "./global.types";

import Screen from "./classes/Screen";
import UI from "./classes/UI";
import Game from "./classes/Game";


document.addEventListener('DOMContentLoaded', () => {
    const screen: ScreenType = new Screen({
        width: 800,
        height: 500,
        background: 'black',
        selector: 'div[data-game-id="brick-breaker"] canvas',
        boundaryPadding: 10,
        boundsColor: 'red',
        boundsThickness: 2,
        hideMouse: true,
    });


    const ui: UIType = new UI({
        screen: screen,
        fontSize: 16,
    });

    ui.createElement({
        id: 'scores',
        label: 'Scroes',
        x: 20,
        y: 30,
    });

    const game: GameType = new Game({
        screen: screen,
        bricksGridPos: {
            startX: 0 + (screen.bounds.padding * 8),            // start x
            startY: 0 + (screen.bounds.padding * 8),            // start y
            endX: screen.width - (screen.bounds.padding * 8),   // end x
            endY: 300 + (screen.bounds.padding * 2)             // end y
        },

        onBrickBreak: (bounces: BounceStatisticsType) => {
            ui.getElementById('scores').updateValue(bounces.fromBrick * 10);
        }
    });


    // interactions
    document.body.addEventListener('mousemove', (event) => {
        // limit platform's movement
        if (event.layerX >= 0 && event.layerX <= screen.width) {
            let { platform, ball } = game.objects;
            let newX = event.layerX - (platform.width / 2);

            if (newX >= screen.bounds.rect.left && newX <= screen.bounds.rect.right - platform.width) {
                platform.x = newX;

                if (ball.isLinkedToPlatform === true) {
                    ball.x = newX + (platform.width / 2);
                }
            }
        }
    });


    screen.body.addEventListener('click', () => {
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
        screen.drawBackground();
        screen.drawBoundary();

        // run - calc ball pos each frame
        game.run();

        // process all intersections between platform, ball, bricks, bounds
        game.processIntersections();

        // draw all objects, using their new states
        game.render();

        // render ui new values (depening on 'events')
        ui.render();

        requestAnimationFrame(loop);
    }


    // calling main function using 'requestAnimationFrame()'
    requestAnimationFrame(loop);

    console.log(game);
});