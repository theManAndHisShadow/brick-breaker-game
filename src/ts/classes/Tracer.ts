import { ScreenType, TracerItem, TracerType } from "../global.types";
import { getArrayLast, changeColorOpacity } from "../helpers";

interface TracerParams {
    memoryLimit?: number,
};

export default class Tracer implements TracerType {
    memoryLimit: number;
    trainType: string;
    color: string;

    protected trace: TracerItem[] = [];

    constructor(params: TracerParams){
        const defaultParams = {
            memoryLimit: 25,
            trainType: 'solid',
            color: 'rgba(255, 255, 255, 1)',
        }

        params = {...params, ...defaultParams};

        // fill new instance structure
        Object.assign(this, params);
    }

    getLastPoint(): TracerItem | boolean {
        return this.trace.length > 0 ? getArrayLast(this.trace) : false;
    }

    getlength(): number {
        return this.trace.length;
    }

    add(point: TracerItem): void {
        // if point x and y is correct values
        if(typeof point.x == 'number' && typeof point.y == 'number'){
            // if overload - remove first elements
            if(this.trace.length >= this.memoryLimit) {
                this.trace.shift();
            }

            this.trace.push(point);
        }
    }

    renderAt(screenReference: ScreenType): void {
        const { context } = screenReference;
    
        context.lineWidth = 1;
    
        // checks if it's the first point
        let previousPoint: TracerItem | boolean = false;
    
        // Draw trace segment by segment using all current trace
        this.trace.forEach((point, index) => {
            if (typeof previousPoint !== "boolean") {
                // Calculate percentage of the current point in the trace
                const percentage = index / this.trace.length;
    
                // Set stroke color with adjusted alpha for the segment
                context.strokeStyle = changeColorOpacity(this.color, percentage);
    
                // Draw line segment with adjusted transparency
                context.beginPath();
                context.moveTo(previousPoint.x, previousPoint.y);
                context.lineTo(point.x, point.y);
                context.stroke();
            }
    
            // Update previousPoint for the next segment
            previousPoint = point;
        });
    }
}