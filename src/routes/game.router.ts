import { Router } from 'express';
import { GameModel } from '../models/game.model';
import { CategoryService } from '../services/category.services';

const gameRouter = Router();
const gameService = new CategoryService();

gameRouter.post('/', (request, response) => {
    
})
export default gameRouter;