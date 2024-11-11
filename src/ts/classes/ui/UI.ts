import { ScreenType, UIElementType, UIType, UIElementBoundingRectType, PictogramType } from "../../global.types";
import Pictogram from "./Pictogram";

interface UIparams {
    screen: ScreenType, 
    fontSize?: number, 
    fontName?: string, 
    lineSpacing?: number,
    labelColor?: string, 
    valueColor?: string, 
};

interface UIElementParams {
    id: string,
    label: string,
    value?: number | string | boolean | PictogramType | PictogramType[],
    x: number,
    y: number,
    fontSize?: number,
    fontName?: string,
    labelColor?: string,
    valueColor?: string,
    lineSpacing?: number,
}

interface UICreateElementMethodParams { 
    id: string; 
    label: string; 
    x: number; 
    y: number; 
    value?: number | string | boolean | PictogramType | PictogramType[]; 
    valueColor?: string
}

class UIElement implements UIElementType {
    id: string;
    label: string;
    value: number | string | boolean | PictogramType | PictogramType[];
    parent: UIType;
    x: number;
    y: number;
    rect: UIElementBoundingRectType;
    fontSize: number;
    fontName: string;
    labelColor: string;
    valueColor: string;
    lineSpacing: number;

    constructor(params: UIElementParams) {
        Object.assign(this, params);

        const { context } = this.parent.screen;

        // Setting the font before measurements
        context.font = `${params.fontSize}px ${params.fontName}`;  
            
        let value = 0;
        const rect: UIElementBoundingRectType = {
            topLeft:     {x: 0, y: 0},
            bottomLeft:  {x: 0, y: 0},
            topRight:    {x: 0, y: 0},
            bottomRight: {x: 0, y: 0},
        };

        // Save the full text of the label
        let labelText = `${this.label}:`;

        // Getting the sizes of text elements
        let labelRect = context.measureText(labelText);
        let valueRect = context.measureText(`${value}`);

        // Calculate the actual width and height
        let actualWidth = labelRect.width + valueRect.width;
        let actualHeight = labelRect.actualBoundingBoxAscent + labelRect.actualBoundingBoxDescent;

        rect.topLeft     = { x: this.x, y: this.y };
        rect.bottomLeft  = { x: this.x, y: this.y + actualHeight + this.lineSpacing };
        rect.topRight    = { x: this.x + actualWidth, y: this.y };
        rect.bottomRight = { x: this.x + actualWidth, y: this.y + actualHeight + this.lineSpacing };

        this.rect = rect;
    }

    updateValue(newValue: any): void {
        this.value = newValue;
    }

    render(): void {
        const { context } = this.parent.screen;
        const isPrimitiveValue = typeof this.value === "number" || typeof this.value === "string" || typeof this.value === "boolean";

        // render label
        // Font for rendering text  (setting second time)
        context.font = `${this.fontSize}px ${this.fontName}`;  

        // Rendering the element label
        context.fillStyle = this.labelColor;
        context.fillText(`${this.label}: `, this.x, this.y);

        // render value
        if(isPrimitiveValue) {

            // Render the element value with the correct labell width offset
            context.fillStyle = this.valueColor;
            context.fillText(`${this.value}`, this.x + context.measureText(`${this.label}`).width + 13, this.y);
        } else {
            if(Array.isArray(this.value)) {                     // array of pictograms
                this.value.forEach((pictogram, index) => {
                    if(pictogram instanceof Pictogram) {
                        pictogram.renderAt(this.parent.screen); 
                    }
                });
            } else if(this.value instanceof Pictogram) {       // single pictogram
                this.value.renderAt(this.parent.screen);
            }
        }

    }
}

export default class UI implements UIType {
    items: UIElement[];
    screen: ScreenType;

    constructor(params: UIparams){
        Object.assign(this, params);

        this.items = [];
    }

    createElement(params: UICreateElementMethodParams): UIElementType {
        // Set default ui element params
        const defaultParams = {
            value: 0,
            parent: this,
            fontSize: 16,          
            fontName: 'monospace', 
            lineSpacing: 4,        
            labelColor: 'white',   
            valueColor: 'white',   
        };

        // combining passed params from external and default aprams
        let newElement = new UIElement({
            ...defaultParams, 
            id: params.id,
            label: params.label,
            x: params.x,
            y: params.y,
            value: params.value !== undefined ? params.value : defaultParams.value,
            valueColor: params.valueColor !== undefined ? params.valueColor : defaultParams.valueColor,
        });

        this.items.push(newElement);

        return newElement;
    }

    getElementById(id: string): UIElement {
        return this.items.find(item => item.id === id);
    }

    render(): void {
        for(let uiElement of this.items) {
            uiElement.render();
        }
    }
}