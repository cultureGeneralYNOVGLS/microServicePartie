import { Router } from 'express';
import { CategoryModel } from '../models/category.model';
import { CategoryService } from '../services/category.services';

const categorieRouter = Router();
const categorieService = new CategoryService();

categorieRouter.get('/', (request, response) => {
    categorieService.getAll().then((categories : CategoryModel[]) => {
        response.json(categories)
    })
})
categorieRouter.get('/setup', (request, response) => {
    categorieService.setupCat();
})

export default categorieRouter;