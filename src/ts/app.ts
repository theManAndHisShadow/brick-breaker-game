import { ScreenType, UIType, GameType, BounceStatisticsType, GameEventData, SoundComposerType } from "./global.types";

import Screen from "./classes/core/Screen";
import Game from "./classes/core/Game";
import UI from "./classes/ui/UI";
import FPSMeter from "./classes/ui/FPSMeter";
import SoundComposer from "./classes/core/SoundComposer";
import Pictogram from "./classes/ui/Pictogram";


document.addEventListener('DOMContentLoaded', () => {
    const screen: ScreenType = new Screen({
        width: 800,
        height: 500,
        background: 'rgba(12, 7, 7, 1)',
        selector: 'div[data-game-id="brick-breaker"] canvas',
        boundaryPadding: 10,
        boundsColor: 'rgba(255, 0, 0, 1)',
        boundsThickness: 2,
        hideMouse: true,
    });


    const ui: UIType = new UI({
        screen: screen,
        fontSize: 16,
    });

    ui.createElement({
        id: 'current_level',
        label: 'Level',
        value: 1,
        x: 20,
        y: 30,
    });

    ui.createElement({
        id: 'scores',
        label: 'Scroes',
        x: 20,
        y: 50,
    });

    ui.createElement({
        id: 'lives',
        label: 'Lives',
        value: [
            new Pictogram({
                width: 16,
                height: 16,
                x: 80,
                y: 56,
                texture: './assets/textures/heart.png',
            }),
            new Pictogram({
                width: 16,
                height: 16,
                x: 102,
                y: 56,
                texture: './assets/textures/heart.png',
            }),
            new Pictogram({
                width: 16,
                height: 16,
                x: 124,
                y: 56,
                texture: './assets/textures/heart.png',
            })
        ],
        valueColor: "red",
        x: 20,
        y: 70,
    });

    const sounds: SoundComposerType = new SoundComposer({
        rootPath: './assets/audio/',
    });

    // todo: move to own loading process method :)
    sounds.loadFile({
        type: 'sfx',
        name: 'platform_bounce',
        filename: 'platform_bounce.mp3',
    });

    sounds.loadFile({
        type: 'sfx',
        name: 'brick_pop',
        filename: 'brick_pop.mp3',
    });

    sounds.loadFile({
        type: 'sfx',
        name: 'bound_bounce',
        filename: 'bound_bounce.mp3',
    });

    sounds.loadFile({
        type: 'music',
        name: 'welcome',
        filename: 'welcome.mp3',
    });

    const game: GameType = new Game({
        screen: screen,
        neonStyle: true,
        bricksGridPos: {
            startX: 0 + (screen.bounds.padding * 10),            // start x
            startY: 0 + (screen.bounds.padding * 8),             // start y
            endX: screen.width - (screen.bounds.padding * 8),    // end x
            endY: 300 + (screen.bounds.padding * 2)              // end y
        },
    });

    game.addEventListener('brickBreak', data => {
        ui.getElementById('scores').updateValue(data.fromBrick * 10);

        sounds.play('sfx', `brick_pop`, 1);
    });

    game.addEventListener('platformBounce', data => {
        sounds.play('sfx', 'platform_bounce', 1);
    });

    game.addEventListener('boundBounce', data => {
        sounds.play('sfx', 'bound_bounce', 1);
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

    // 
    const fpsMeter = new FPSMeter({
        x: screen.body.width - 80,
        y: 30,
        color: `rgba(255, 255, 255, 0.4)`,
    });

    setTimeout(() => {
        sounds.play('music', 'welcome', 1);
    }, 500);

    // main function
    const loop = () => {
        requestAnimationFrame(loop);

        // Screen.clear();
        screen.drawBackground();
        screen.drawBoundary(game.neonStyle);

        // run - calc ball pos each frame
        game.run();

        // process all intersections between platform, ball, bricks, bounds
        game.processIntersections();

        // draw all objects, using their new states
        game.render();

        // render ui new values (depening on 'events')
        ui.render();

        // render current fps value
        fpsMeter.renderAt(screen);

        screen.renderCrtFilter();
    }


    // calling main function using 'requestAnimationFrame()'
    requestAnimationFrame(loop);

    console.log(game);
});