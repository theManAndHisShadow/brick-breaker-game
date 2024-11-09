import { GameEventData, GameEventStorage } from "../../global.types";

// The GameEventTarget class is designed to handle custom events. It allows storing
// multiple callbacks for different event types. Each callback can be executed with 
// provided data whenever the event is triggered, making it a flexible event-handling
// solution for various use cases in the code.
export default class GameEventTarget {
    // Holds registered event listeners. Each event name maps to an array of callbacks
    // associated with that event. When an event is triggered, all corresponding callbacks
    // in the array are executed.
    events: GameEventStorage;

    constructor() {
        this.events = {};
    }

    // Method to add a new event listener (callback function) for a specific event.
    // If no listeners exist for the given event name, an array is created to hold them.
    // The callback is then added to the array of listeners for that event.
    // This method allows you to register multiple callbacks for the same event type.
    addEventListener(eventName: string, callback: (data: GameEventData) => void) {
        // Check if the event name already has an array of listeners; if not, create it.
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        
        // Add the provided callback function to the array of listeners for the specified event name.
        this.events[eventName].push(callback);
    }

    // Method to manually trigger (dispatch) a specific event. This will execute all callbacks
    // associated with the given event name, passing the provided data object to each one.
    // Useful for triggering custom events programmatically with relevant data.
    dispatchEvent(eventName: string, data: GameEventData) {
        // Check if there are listeners for the specified event name
        if (this.events[eventName]) {
            // Execute each callback function with the provided data object
            this.events[eventName].forEach(callback => callback(data));
        }
    }
}
