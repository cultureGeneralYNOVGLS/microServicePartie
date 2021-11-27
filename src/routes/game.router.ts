import { Router } from 'express';
import { GameModel } from '../models/game.model';
import { GameService } from '../services/game.services';

const gameRouter = Router();
const gameService = new GameService();


gameRouter.get('/:gameID', async (request, response) => {
    response.json(await gameService.getGame(request.params.gameID));
})

gameRouter.post('/', (request, response) => {
    let body: { idUser: string, difficulty: number, numberQuestions: number, idCategory: string, name: string } = {
        ...request.body
    };
    gameService.createUser(body.idUser, body.difficulty, body.numberQuestions, body.idCategory, body.name).then((game: GameModel) => {
        response.json(game)
    });
})

gameRouter.patch('/:gameID', async (request, response) => {
    response.json(await gameService.playGame(request.params.gameID, request.body.answer));
})
gameRouter.delete('/:gameID', async (request, response) => {
    response.sendStatus(await gameService.deleteGame(request.params.gameID));
})

gameRouter.get('/user/:idUser', async (request, response) => {
    response.json(await gameService.getGamesOfUser(request.params.idUser));
})
gameRouter.get('/category/:idCategory', async (request, response) => {
    response.json(await gameService.getGamesOfCategory(request.params.idCategory));
})


export default gameRouter;