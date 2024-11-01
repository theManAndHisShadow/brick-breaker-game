import getScreen from "./screen";
import getUI from "./ui";
import getGame from "./game";

import { Screen, UI, Game, BounceStatistics } from "./global.types";

document.addEventListener('DOMContentLoaded', () => {
    const Screen: Screen = getScreen({
        width: 800,
        height: 500,
        background: 'black',
        selector: 'div[data-game-id="brick-breaker"] canvas',
        boundaryPadding: 10,
        boundsColor: 'red',
        boundsThickness: 2,
        hideMouse: true,
    });


    const UI: UI = getUI({
        screen: Screen,
        fontSize: 16,
    });

    const Game: Game = getGame({
        screen: Screen,
        bricksGridPos: {
            startX: 0 + (Screen.bounds.padding * 8),            // start x
            startY: 0 + (Screen.bounds.padding * 8),            // start y
            endX: Screen.width - (Screen.bounds.padding * 8),   // end x
            endY: 300 + (Screen.bounds.padding * 2)             // end y
        },

        onBrickBreak: (bounces: BounceStatistics) => {
            UI.getElementById('scores').updateValue(bounces.fromBrick * 10);
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
                    ball.x = newX + (platform.width / 2);
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