function getGame({bricksGridPos, screen, onBrickBreak = () => {}}){
    let score = 0;
    
    const objects = {
        platform: {
            width: 100,
            height: 8,
            x: (screen.width / 2) - (100 / 2),
            y: screen.height - 69,
            shape: 'rect',
            color: 'rgb(115, 115, 115)',
            type: 'platform',
        },
        ball: {
            type: 'ball',
            color: 'white',
            shape: 'circle',
            cx: screen.width / 2,
            cy: screen.height - 75,
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
            bricksGridPos.startX,
            bricksGridPos.startY,
            bricksGridPos.endX,
            bricksGridPos.endY,
        ),

        all: [],
    };

    // link special 'all' value
    objects.all = [objects.platform, objects.ball, ...objects.bricks];

    return {
        score: score,
        objects: objects,
        render: () => {
            const { context } = screen;

            // intersections
            checkIntersections(objects.ball, objects.platform, objects.bricks, screen.bounds, onBrickBreak);
        
            // ball movements
            calcBallNextPos(objects.ball);
        
            for (let object of objects.all) {
                let { shape } = object;
        
                if (shape === 'rect') {
                    let { x, y, width, height, type, color } = object;
        
                    context.fillStyle = color;
                    context.fillRect(x, y, width, height);
                } else if (shape === 'circle') {
                    let { cx, cy, size, color, type, isLinkedToPlatform } = object;
        
                    context.beginPath();
                    context.arc(cx, cy, size, 0, 2 * Math.PI, false);
                    context.fillStyle = isLinkedToPlatform === true ? 'green' : color;
                    context.fill();
                    context.closePath();
                }
            }
        },
    }
}