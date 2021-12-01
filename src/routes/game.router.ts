import { Router } from 'express';
import { GameModel } from '../models/game.model';
import { GameService } from '../services/game.services';

const userToken = require('../middleware/userToken.middleware');
const getKeyUser = require('../middleware/microserviceUserGetKey.middleware');

const gameRouter = Router();
const gameService = new GameService();


gameRouter.get('/getkey', async (request, response) => {
    response.sendStatus(200);
})

gameRouter.get('/:gameID',getKeyUser,userToken, async (request, response) => {
    console.log("GET GAME");
    response.json(await gameService.getGame(request.params.gameID));
})

gameRouter.post('/',getKeyUser,userToken, (request, response) => {
    const body: { idUser: string, difficulty: number, numberQuestions: number, idCategory: string, name: string } = {
        ...request.body
    };
    gameService.createUser(body.idUser, body.difficulty, body.numberQuestions, body.idCategory, body.name).then((game: GameModel) => {
        response.json(game)
    });
})

gameRouter.patch('/:gameID',getKeyUser,userToken, async (request, response) => {
    response.json(await gameService.playGame(request.params.gameID, request.body.answer));
})
gameRouter.delete('/:gameID',getKeyUser,userToken, async (request, response) => {
    response.sendStatus(await gameService.deleteGame(request.params.gameID));
})

gameRouter.get('/user/:idUser',getKeyUser,userToken, async (request, response) => {
    response.json(await gameService.getGamesOfUser(request.params.idUser));
})
gameRouter.get('/category/:idCategory',getKeyUser,userToken, async (request, response) => {
    response.json(await gameService.getGamesOfCategory(request.params.idCategory));
})


export default gameRouter;