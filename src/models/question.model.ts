import { ObjectId } from "bson";

export interface QuestionModel {
    _id: ObjectId;
    idCategory: ObjectId;
    question: string;
    good_answer: string;
    answers: string[];
    difficulties: number[];
}