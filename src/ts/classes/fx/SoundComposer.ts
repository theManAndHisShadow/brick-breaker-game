import { SoundComposerType, SoundStorage } from "../../global.types";

export default class SoundComposer implements SoundComposerType {
    context: AudioContext;
    sfx: SoundStorage;
    music: SoundStorage;

    constructor(){
        // prop to saving Audio Context 
        this.context = new AudioContext();

        // sound effects data
        this.sfx = {}

        // music data
        this.music = {}
    }

    /**
     * Loads file to SoundComposer
     */
    loadFile ({path, type, name}: {path: string, type: "sfx" | "music", name: string}): void {
        const request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = () => {
            this.context.decodeAudioData(request.response, buffer => {
                if (!buffer) {
                    console.log('Error decoding file data: ' + path);
                    return;
                }

                this[type][name] = buffer;
            });
        };

        request.onerror = function() {
            console.log('BufferLoader: XHR error');        
        };

        request.send();
    }


    /**
     * Play target sound file 
     */
    play (type: "sfx" | "music", name: string, gain: number): void {
        if(!this[type]) {
            throw new Error("Unknown sound type '"+ type +"'!");
        }

        if(this[type] && !this[type][name]) {
            throw new Error("Unknown sound name '"+ name +"'!");
        }

        if(this[type] && this[type][name]){
            let source = this.context.createBufferSource();    // creates a sound source
            source.buffer = this[type][name];                  // tell the source which sound to play
            
            let gainNode = this.context.createGain();          // Create a gain node
            gainNode.connect(this.context.destination);        // Connect the gain node to the destination
            gainNode.gain.value = gain;                        // Set the volume
            
            source.connect(gainNode);                          // Connect the source to the gain node
            
            // Zero in function below means timecode of staring pay process
            source.start(0);  

            // Cleaning some parts after completion 
            source.onended = () => {
                source.disconnect(gainNode);
                gainNode.disconnect(this.context.destination);
            };
        } 
    }
}


export { SoundComposer };