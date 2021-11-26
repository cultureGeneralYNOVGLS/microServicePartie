import { ObjectId } from "bson";

export interface QuestionModel {
    _id: ObjectId;
    idCategory: ObjectId;
    question: string;
    goodAnswer: string;
    answers: string[];
    difficulties: number[];
}