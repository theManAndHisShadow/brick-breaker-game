import { PrimitiveType } from "../global.types";

export default class Primitive implements PrimitiveType {
    width: number;
    height: number;
    x: number;
    y: number;
    type: string;
    shape: string;
    color: string;

    constructor(params: PrimitiveType){
        Object.assign(this, params);
    }
}