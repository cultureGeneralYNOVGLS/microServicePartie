
import { GameModel } from '../models/game.model';
import { CategoryModel } from '../models/category.model';
import { QuestionModel } from '../models/question.model';

import { MongoUtils } from '../utils/mongo.utils';
import * as mongoDB from "mongodb";
const faker = require('faker');


export class CategoryDAO {
    db: mongoDB.Db
    mongoUtils = new MongoUtils();
    collectionCategory = 'category';
    collectionQuestion = 'question';
    defaultCategories: string[] = []


    constructor() {
        this.mongoUtils.dbConnect().then((database: mongoDB.Db) => {
            this.db = database;
        }).catch((err) => {
            console.log('Erreur pendant l’initialisation de la BD : ' + err.message);
        });
    }

    async getAll(): Promise<CategoryModel[]> {
        const categories = (await this.db.collection(this.collectionCategory).find({}).toArray()) as CategoryModel[];
        return categories;
    }
    async getByID(idCategoryObjectID: mongoDB.ObjectId): Promise<CategoryModel> {
        const games = (await this.db.collection(this.collectionCategory).find({_id:idCategoryObjectID}).toArray()) as CategoryModel[];
        return games[0];
    }
    async getQuestionsByIdCategory(idCategory: mongoDB.ObjectId, numberQuestions : number): Promise<QuestionModel[]> {
        const questions = (await this.db.collection(this.collectionQuestion).find({idCategory:idCategory}).toArray()) as QuestionModel[];
        let questionsShuffle = this.shuffleArray(questions);
        const slicedQuestions = questionsShuffle.slice(0, numberQuestions);

        return slicedQuestions;
    }


    async setupCategories() {
        await this.db.collection(this.collectionCategory).deleteMany({});

        for (let i = 0; i < 10; i++) {

            let category: CategoryModel = {
                name: faker.lorem.word(),
                _id: new mongoDB.ObjectId()
            };
            this.db.collection(this.collectionCategory).insertOne(category);

            for (let y = 0; y < 20; y++) {

                let goodAnswer = faker.lorem.word();

                let question: QuestionModel = {
                    _id: new mongoDB.ObjectId(),
                    goodAnswer: goodAnswer,
                    answers: this.shuffleArray([goodAnswer, faker.lorem.word(), faker.lorem.word(), faker.lorem.word()]),
                    difficulties: [1, 2],
                    question: faker.lorem.sentence(),
                    idCategory: category._id
                };

                this.db.collection(this.collectionQuestion).insertOne(question);
            }
        }

    }


    shuffleArray(arr: any[]): any[] {
        return Array(arr.length).fill(null)
            .map((_, i) => [Math.random(), i])
            .sort(([a], [b]) => a - b)
            .map(([, i]) => arr[i])
    }
}