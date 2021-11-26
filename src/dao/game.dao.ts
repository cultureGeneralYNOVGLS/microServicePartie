
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

    create(game:GameModel) : GameModel {
        this.db.collection('game').insertOne(game);
        return game;
    }
    update(game: GameModel) {
        this.db.collection('game').updateOne({_id:game._id},{$set:game});
        return game;
    }

    async getById(gameID : ObjectID) : Promise<GameModel> {
        const games = (await this.db.collection(this.collectionGame).find({_id:gameID}).toArray()) as GameModel[];
        return games[0];
    }
    async getByUserId(idUser: string): Promise<GameModel[]> {
        const games = (await this.db.collection(this.collectionGame).find({idUser:idUser}).toArray()) as GameModel[];
        return games;
    }
    async getByUserCategory(idCategory: ObjectID): Promise<GameModel[]> {
        const games = (await this.db.collection(this.collectionGame).find({"category._id":idCategory}).toArray()) as GameModel[];
        return games;
    }


}
