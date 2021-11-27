import { CategoryModel } from "../models/category.model";
import { GameModel } from "../models/game.model";
import { QuestionModel } from "../models/question.model";

import { CategoryDAO } from "../dao/category.dao";
import { GameDAO } from "../dao/game.dao";

import * as mongoDB from "mongodb";
import { ObjectID } from 'bson';

const faker = require('faker');

export class GameService {
    private gameDAO: GameDAO = new GameDAO()
    private categoriesDAO: CategoryDAO = new CategoryDAO()
    private checkForValidMongoDbID = new RegExp("^[0-9a-fA-F]{24}$");

    async createUser(idUser: string, difficulty: number, numberQuestions: number, idCategory: string,name:string): Promise<GameModel|any> {


        if (this.validCreateBody(idUser, difficulty, numberQuestions, idCategory)) {

            if (this.checkForValidMongoDbID.test(idCategory)) {
                let idCategoryObjectID = new ObjectID(idCategory);

                let questions: QuestionModel[] = [];

                const categorie: CategoryModel = await this.categoriesDAO.getByID(idCategoryObjectID);
                questions = await this.categoriesDAO.getQuestionsByIdCategory(idCategoryObjectID, numberQuestions)


                let game: GameModel = {
                    _id: new mongoDB.ObjectId(),
                    idUser: idUser,
                    name:name || faker.lorem.word(),
                    category: categorie,
                    difficulty: difficulty,
                    progressionQuestions: 1,
                    numberQuestions: numberQuestions,
                    score: 0,
                    idQuestionProgression: questions[0]._id,
                    questions: questions,
                    answer: [],
                    status: "not started"
                }

                if (this.validGame(game)) {
                    this.gameDAO.create(game);
                    return game;
                }
                else {
                    return {error:'Game Not Valid'};
                }
            }
            else {
                return {error:'idCategory Not Valid'};
            }

        }
        else {
            return {error:'Body Not Valid'};
        }
    }

    async getGame(gameID: string): Promise<GameModel | any> {

        if (this.checkForValidMongoDbID.test(gameID)) {
            let game: GameModel = await this.gameDAO.getById(new ObjectID(gameID));

            if (game.progressionQuestions === null) {
                return game;
            }
            else {
                return game;
            }

        }
        else {
            return null;
        }
    }

    async getGamesOfUser(idUser: string): Promise<GameModel[]> {
        let game: GameModel[] = await this.gameDAO.getByUserId(idUser);
        return game;
    }
    async getGamesOfCategory(idCategory: string): Promise<GameModel[]> {
        if (this.checkForValidMongoDbID.test(idCategory)) {
            let game: GameModel[] = await this.gameDAO.getByUserCategory(new ObjectID(idCategory));
            return game;
        }
        else {
            return null;
        }
    }
    async playGame(gameID: string, answer: any): Promise<GameModel | any> {

        if (this.checkForValidMongoDbID.test(gameID)) {
            let game = await this.gameDAO.getById(new ObjectID(gameID));

            if (game.progressionQuestions === null) {
                return game;
            }
            else {
                const question = game.questions.find(quest => quest._id.equals(game.idQuestionProgression));

                if (question) {
                    if (question.goodAnswer === answer) {
                        game.score++;
                    }
                    game.progressionQuestions++;
                    game.answer.push(answer);

                    if (game.progressionQuestions <= game.numberQuestions) {
                        game.idQuestionProgression = game.questions[game.progressionQuestions - 1]._id;
                        game.status = 'in progress';

                        return this.gameDAO.update(game);
                    }
                    else {
                        game.idQuestionProgression = null;
                        game.progressionQuestions = null;
                        game.status = 'finish';

                        return this.gameDAO.update(game);
                    }
                }
                else {
                    return null;
                }
            }


        }
        else {
            return null;
        }
    }
    async deleteGame(gameID: string) : Promise<number> {

        if (this.checkForValidMongoDbID.test(gameID)) {
            let game = await this.gameDAO.getById(new ObjectID(gameID));
            if (game) {
                this.gameDAO.delete(game);
                return 200;
            }
            else {
                return 404;
            }
        }
        else {
            return 500;
        }
    }
    validCreateBody(idUser: string, difficulty: number, numberQuestions: number, idCategory: string): boolean {
        if (idUser && difficulty && numberQuestions && idCategory) {
            return true;
        }
        else {
            return false;
        }
    }

    validGame(game: GameModel) {
        return game && game.difficulty && game.category && game.idQuestionProgression && game.idUser && game.numberQuestions && game.progressionQuestions && game.questions
    }




}