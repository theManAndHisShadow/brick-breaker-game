export default function getScreen({width = 400, height = 400, fillColor = 'rgba(0, 0, 0, 1)', hideMouse = false, selector = 'canvas',  boundaryPadding = 0, boundsColor, boundsThickness}) {
    const canvas = document.querySelector(selector);
    const context = canvas.getContext('2d');
    const boundsObject = {
        padding: boundaryPadding,

        left: 0 + boundaryPadding,
        right: width - boundaryPadding,
        top: 0 + boundaryPadding,
        bottom: height - boundaryPadding,
    }

    // set canvas sizes
    canvas.width = width;
    canvas.height = height;

    if(hideMouse) {
        canvas.addEventListener('mouseenter', () => {
            canvas.style.cursor = 'none';
        });

        canvas.addEventListener('mouseover', () => {
            canvas.style.cursor = 'initial';
        });
    }

    return {
        body: canvas,
        context: context,
        width: width,
        height: height,
        bounds: boundsObject,

        clear: () => {
            context.clearRect(0, 0, width, height);
        },

        drawBackground: () => {
            context.fillStyle = fillColor;
            context.fillRect(0, 0, width, height);
        },

        drawBoundary: () => {
            context.strokeStyle = boundsColor;
            context.lineWidth = boundsThickness;
            context.strokeRect(boundsObject.left, boundsObject.top, boundsObject.right - boundaryPadding, boundsObject.bottom - boundaryPadding);
        },
    }
}