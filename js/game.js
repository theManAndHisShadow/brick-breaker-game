
function drawGameFrame(screenObject, gameObject){
    const { context } = screenObject;

    // intersections
    checkIntersections(gameObject.objects.ball, gameObject.objects.platform, gameObject.objects.bricks, screenObject.bounds);

    // ball movements
    calcBallNextPos(gameObject.objects.ball);

    for (let object of gameObject.objects.all) {
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
}