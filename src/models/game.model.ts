import { ObjectId } from "bson";

export interface GameModel {
    _id: ObjectId;
    idUser:string;
    idCategory:ObjectId;
    difficulty:number;
    progression_questions:number;
    number_questions:number;
    score:number;
    idQuestion:ObjectId;
}