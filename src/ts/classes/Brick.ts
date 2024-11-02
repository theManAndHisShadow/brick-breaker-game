import Primitive from "./Primitive";
import { BrickType } from "../global.types";

export default class Brick extends Primitive implements BrickType {
    health: number;
    
    constructor(params: BrickType){
        super(params);

        Object.assign(this, params);
    }
}