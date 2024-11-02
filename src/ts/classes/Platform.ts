import Primitive from "./Primitive";
import { PlatformType } from "../global.types";

export default class Platform extends Primitive implements PlatformType {
    constructor(params: PlatformType){
        super(params);
    }
}