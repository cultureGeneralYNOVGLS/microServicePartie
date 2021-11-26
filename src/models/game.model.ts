import { ObjectId } from "bson";
import { CategoryModel } from "./category.model";
import { QuestionModel } from "./question.model";

export interface GameModel {
    _id: ObjectId;
    idUser:string;
    name:string
    status: string;
    score:number;
    category:CategoryModel;
    difficulty:number;
    progression_questions:number;
    numberQuestions:number;
    idQuestionProgression:ObjectId;
    answer : string[];
    questions : QuestionModel[];
}