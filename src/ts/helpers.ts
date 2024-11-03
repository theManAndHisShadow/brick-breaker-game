export function getRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}



export function getRandomInt(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max + 1 - min));
}



export function getArrayLast(array: any[]){
    return array[array.length - 1];
}



export function changeColorOpacity(rgba: string, newOpacity: number): string{
    newOpacity = Math.max(0, Math.min(newOpacity, 1));

    // split to components and change alpha component, then compose and return
    return rgba.split(', ').map((c, i) => { if(i == 3) c = newOpacity + ')'; return c;}).join(', ');
}