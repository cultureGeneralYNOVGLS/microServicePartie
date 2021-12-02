import { Router } from 'express';
import { CategoryModel } from '../models/category.model';
import { CategoryService } from '../services/category.services';

const userToken = require('../middleware/userToken.middleware');
const getKeyUser = require('../middleware/microserviceUserGetKey.middleware');

const categorieRouter = Router();
const categorieService = new CategoryService();

/**
 * @openapi
 * /api/game/category:
 *   get:
 *     summary: Retrieve a list of category
 *     description: Retrieve a list of category
 */
categorieRouter.get('/',getKeyUser, userToken, (request, response) => {
    console.log(1, 'route');
    categorieService.getAll().then((categories : CategoryModel[]) => {
        console.log(6, categories);
        response.json(categories)
    })
})

/**
 * @openapi
 * /api/game/category/setup:
 *   post:
 *     summary: Create 10 categories in category collection
 *     description: Create 10 categories in category collection
 */
categorieRouter.post('/setup', (request, response) => {
    categorieService.setupCat();
})

export default categorieRouter;