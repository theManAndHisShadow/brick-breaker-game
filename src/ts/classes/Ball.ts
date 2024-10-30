import Primitive from "./Primitive";
import { BounceStatisticsType, BallType } from "../global.types";

export default class Ball extends Primitive implements BallType {
    dx: number;
    dy: number;
    angle: number;
    isLinkedToPlatform: boolean;
    isWaitingStart: boolean;
    bounces: BounceStatisticsType;

    constructor(params: BallType){
        super(params);
        
        Object.assign(this, params);
    }
}