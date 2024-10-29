
function getUI({ screen, fontSize = 20, fontName = 'monospace', lineSpacing = 4, labelColor = 'white', valueColor = 'white'}) {
    const { context } = screen;

    const getNewUIelement = function({name, x = 0, y = 0}) {
        // Setting the font before measurements
        context.font = `${fontSize}px ${fontName}`;  
    
        let value = 0;
        const rect = {};
    
        // Save the full text of the label
        let labelText = `${name}:`;
    
        // Getting the sizes of text elements
        let labelRect = context.measureText(labelText);
        let valueRect = context.measureText(value);
    
        // Calculate the actual width and height
        let actualWidth = labelRect.width + valueRect.width;
        let actualHeight = labelRect.actualBoundingBoxAscent + labelRect.actualBoundingBoxDescent;
    
        rect.topLeft = { x: x, y: y };
        rect.bottomLeft = { x: x, y: y + actualHeight + lineSpacing };
        rect.topRight = { x: x + actualWidth, y: y };
        rect.bottomRight = { x: x + actualWidth, y: y + actualHeight + lineSpacing };
    
        return {
            rect,
            name,
            value,
    
            updateValue: (newValue) => {
                value = newValue;
            },
    
            render: () => {
                // Font for rendering text  (setting second time)
                context.font = `${fontSize}px ${fontName}`;  
    
                // Rendering the element label
                context.fillStyle = labelColor;
                context.fillText(labelText, x, y);
    
                // Render the element value with the correct labell width offset
                context.fillStyle = valueColor;
                context.fillText(value, x + labelRect.width, y); 
            },
        };
    };
    

    const score = getNewUIelement({
        x: 20, y: 35,
        name: 'Scores',
    });

    const time = getNewUIelement({
        x: score.rect.bottomLeft.x, 
        y: score.rect.bottomLeft.y,
        name: 'Time',
    });

    const status = getNewUIelement({
        x: time.rect.bottomLeft.x, 
        y: time.rect.bottomLeft.y,
        name: 'Status',
    });

    const items = {
        score: score,
        time: time,
        status: status,
    };

    return {
        items: items,

        render: () => {
            for(let uiElement of Object.values(items)) {
                uiElement.render();
            }
        },
    };
}