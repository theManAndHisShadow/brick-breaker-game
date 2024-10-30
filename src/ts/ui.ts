import { ScreenType, UIType, UIElement, UIElementBoundingRectType } from "./global.types";

interface UIparams {
    screen: ScreenType, 
    fontSize?: number, 
    fontName?: string, 
    lineSpacing?: number,
    labelColor?: string, 
    valueColor?: string, 
};


export default function getUI(params: UIparams): UIType {
    // Set default values
    const defaultParams: UIparams = {
        screen: params.screen, 
        fontSize: 16,          
        fontName: 'monospace', 
        lineSpacing: 4,        
        labelColor: 'white',   
        valueColor: 'white',   
    };

    // combining passed params from external and default aprams
    params = { ...defaultParams, ...params };
    
    const { context } = params.screen;

    const getNewUIelement = function({id, label, x = 0, y = 0}: {id: string, label: string, x: number, y: number}): UIElement {
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
        let labelText = `${label}:`;
    
        // Getting the sizes of text elements
        let labelRect = context.measureText(labelText);
        let valueRect = context.measureText(`${value}`);
    
        // Calculate the actual width and height
        let actualWidth = labelRect.width + valueRect.width;
        let actualHeight = labelRect.actualBoundingBoxAscent + labelRect.actualBoundingBoxDescent;
    
        rect.topLeft     = { x: x, y: y };
        rect.bottomLeft  = { x: x, y: y + actualHeight + params.lineSpacing };
        rect.topRight    = { x: x + actualWidth, y: y };
        rect.bottomRight = { x: x + actualWidth, y: y + actualHeight + params.lineSpacing };

        const newUIElement: UIElement = {
            rect,
            id,
            label,
            value,
    
            updateValue: (newValue: any) => {
                value = newValue;
            },
    
            render: () => {
                // Font for rendering text  (setting second time)
                context.font = `${params.fontSize}px ${params.fontName}`;  
    
                // Rendering the element label
                context.fillStyle = params.labelColor;
                context.fillText(labelText, x, y);
    
                // Render the element value with the correct labell width offset
                context.fillStyle = params.valueColor;
                context.fillText(`${value}`, x + labelRect.width + 3, y); 
            }
        }; 
    
        return newUIElement;
    };
    

    const scores = getNewUIelement({
        x: 20, y: 35,
        id: 'scores',
        label: 'Scroes',
    });

    // const time = getNewUIelement({
    //     x: scores.rect.bottomLeft.x, 
    //     y: scores.rect.bottomLeft.y,
    //     name: 'Time',
    // });

    // const status = getNewUIelement({
    //     x: time.rect.bottomLeft.x, 
    //     y: time.rect.bottomLeft.y,
    //     name: 'Status',
    // });

    const items = [
        scores,

        // Temporarily disabled
        // time: time,
        // status: status,
    ];

    return {
        items: items,

        getElementById: (id) => {
            return items.find(item => item.id === id);
        },

        render: () => {
            for(let uiElement of items) {
                uiElement.render();
            }
        },
    };
}