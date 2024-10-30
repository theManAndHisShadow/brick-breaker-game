export function getRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}




export function getRandomInt(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max + 1 - min));
}