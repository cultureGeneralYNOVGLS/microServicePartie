import { CategoryModel } from "../models/category.model";
import { CategoryDAO } from "../dao/category.dao";
export class CategoryService {
    private categoryDAO: CategoryDAO = new CategoryDAO()

    async getAll() : Promise<CategoryModel[]> {
        return this.categoryDAO.getAll();
    }

    setupCat() {
        console.log(2, 'routes');
        this.categoryDAO.setupCategories();
    }

}