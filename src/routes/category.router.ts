import { Router } from 'express';
import { CategoryModel } from '../models/category.model';
import { CategoryService } from '../services/category.services';

const userToken = require('../middleware/userToken.middleware');
const getKeyUser = require('../middleware/microserviceUserGetKey.middleware');


const categorieRouter = Router();
const categorieService = new CategoryService();

categorieRouter.get('/',getKeyUser,userToken, (request, response) => {
    categorieService.getAll().then((categories : CategoryModel[]) => {
        response.json(categories)
    })
})
categorieRouter.get('/setup', (request, response) => {
    categorieService.setupCat();
})

export default categorieRouter;