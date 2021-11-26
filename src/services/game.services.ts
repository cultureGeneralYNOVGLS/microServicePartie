import { CategoryModel } from "../models/category.model";
import { GameModel } from "../models/game.model";
import { CategoryDAO } from "../dao/category.dao";
import { GameDAO } from "../dao/game.dao";

import * as mongoDB from "mongodb";
import { ObjectID } from 'bson';

export class gameService {

    private GameDAO: GameDAO = new GameDAO()
    private categoriesDAO: CategoryDAO = new CategoryDAO()
    
    createUser(idUser : string, difficulty : number,number_questions:number,idCategory : ObjectID) : GameModel {
        
        let game : GameModel = {
            _id: new mongoDB.ObjectId(),
            idUser: idUser,
            idCategory: idCategory,
            difficulty: difficulty,
            progression_questions: 1,
            number_questions: number_questions,
            score: 0,
            idQuestion: null,
            questions:[]
        }
        
        return null;
    }



}