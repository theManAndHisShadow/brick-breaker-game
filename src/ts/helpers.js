export function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}




export function getRandomInt(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}