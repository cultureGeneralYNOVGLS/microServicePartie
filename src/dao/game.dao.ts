
import { GameModel } from '../models/game.model';
import { CategoryModel } from '../models/category.model';
import { QuestionModel } from '../models/question.model';

import { MongoUtils } from '../utils/mongo.utils';
import * as mongoDB from "mongodb";
import { ObjectID } from 'bson';


export class GameDAO {

    db: mongoDB.Db
    mongoUtils = new MongoUtils();
    collectionCategory = 'category';
    collectionQuestion = 'question';
    collectionGame = 'game';

    constructor() {
        this.mongoUtils.dbConnect().then((database : mongoDB.Db) => {
            this.db = database;
        }).catch((err) => {
            console.error('Erreur pendant l’initialisation de la BD : ' + err.message, 'lists-dao-mongogb.getDbConnection()');
        });
    }

    create(idUser : string, difficulty : number,number_questions:number,idCategory : ObjectID, idQuestion : ObjectID) : GameModel {
        
        let game : GameModel = {
            _id: new mongoDB.ObjectId(),
            idUser: idUser,
            idCategory: idCategory,
            difficulty: difficulty,
            progression_questions: 1,
            number_questions: number_questions,
            score: 0,
            idQuestion: idQuestion
        }

        this.db.collection('game').insertOne(game);
        
        return game;
    }


}
