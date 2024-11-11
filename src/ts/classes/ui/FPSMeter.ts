import { ScreenType } from "../../global.types";

interface FPSMeterParams {
    x: number,
    y: number,
    color: string,
}

export default class FPSMeter {
    x: number;
    y: number;
    color: string;
    // Array of timestamps to store the time of each `requestAnimationFrame` call
    private times: number[] = [];

    // Current FPS value, updated on each frame
    private fps: number = 0;

    constructor(params: FPSMeterParams) {
        this.x = params.x;
        this.y = params.y;
        this.color = params.color;

        // Start the FPS update process when an instance is created
        this.updateFPS();
    }

    // Private method for updating the FPS value
    private updateFPS() {
        // Use `requestAnimationFrame` to synchronize with the target screen's refresh rate
        window.requestAnimationFrame(() => {
            // Get the current timestamp in milliseconds
            const now = performance.now();
            
            // Remove timestamps that are older than 1 second
            // This allows us to consider only frames rendered in the last second
            while (this.times.length > 0 && this.times[0] <= now - 1000) {
                this.times.shift();
            }
            
            // Add the current timestamp to the array
            this.times.push(now);

            // Update the FPS value to the number of frames rendered in the last second
            this.fps = this.times.length - 1;

            // Recursively call `updateFPS` to update the FPS on each frame
            this.updateFPS();
        });
    }

    // Public method for getting the current FPS value
    public getFPS(): number {
        return this.fps;
    }
    
    public renderAt(screenReference: ScreenType): void {
        const { context } = screenReference;

        context.fillStyle = this.color;
        context.fillText(`FPS:${this.getFPS()}`, this.x, this.y);
    }

}
