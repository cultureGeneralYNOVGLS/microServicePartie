import { CategoryModel } from "../models/category.model";
import { CategoryDAO } from "../dao/category.dao";

const amqplib = require("amqplib");

export class CategoryService {


    private categoryDAO: CategoryDAO = new CategoryDAO()

    async getAll() : Promise<CategoryModel[]> {
        return this.categoryDAO.getAll();
    }

    setupCat() {
        this.categoryDAO.setupCategories();
    }

}