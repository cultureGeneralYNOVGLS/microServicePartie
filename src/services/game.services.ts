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

    async createUser(idUser: string, difficulty: number, number_questions: number, idCategory: string,name:string): Promise<GameModel> {


        if (this.validCreateBody(idUser, difficulty, number_questions, idCategory)) {

            if (this.checkForValidMongoDbID.test(idCategory)) {
                let idCategoryObjectID = new ObjectID(idCategory);

                let questions: QuestionModel[] = [];

                const categorie: CategoryModel = await this.categoriesDAO.getByID(idCategoryObjectID);
                questions = await this.categoriesDAO.getQuestionsByIdCategory(idCategoryObjectID, number_questions)


                let game: GameModel = {
                    _id: new mongoDB.ObjectId(),
                    idUser: idUser,
                    name:name || faker.lorem.word(),
                    category: categorie,
                    difficulty: difficulty,
                    progression_questions: 1,
                    number_questions: number_questions,
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
                    return null;
                }
            }
            else {
                return null;
            }

        }
        else {
            return null;
        }
    }

    async getGame(gameID: string): Promise<GameModel | any> {

        if (this.checkForValidMongoDbID.test(gameID)) {
            let game: GameModel = await this.gameDAO.getById(new ObjectID(gameID));

            if (game.progression_questions === null) {
                return { message: 'Finish', game: game };
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

            if (game.progression_questions === null) {
                return { message: 'Finish', game: game };
            }
            else {
                const question = game.questions.find(quest => quest._id.equals(game.idQuestionProgression));

                if (question) {

                    if (question.good_answer === answer) {
                        game.score++;
                    }
                    game.progression_questions++;
                    game.answer.push(answer);

                    if (game.progression_questions <= game.number_questions) {
                        game.idQuestionProgression = game.questions[game.progression_questions - 1]._id;
                        game.status = 'in progress';

                        return this.gameDAO.update(game);
                    }
                    else {
                        game.idQuestionProgression = null;
                        game.progression_questions = null;
                        game.status = 'finish';

                        return { message: 'Finish', game: this.gameDAO.update(game) };
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

    validCreateBody(idUser: string, difficulty: number, number_questions: number, idCategory: string): boolean {

        if (idUser && difficulty && number_questions && idCategory) {
            return true;
        }
        else {
            return false;
        }
    }

    validGame(game: GameModel) {
        return game && game.difficulty && game.category && game.idQuestionProgression && game.idUser && game.number_questions && game.progression_questions && game.questions
    }




}