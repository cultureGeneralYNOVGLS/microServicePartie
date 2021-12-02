import { Router } from 'express';
import { GameModel } from '../models/game.model';
import { GameService } from '../services/game.services';

const userToken = require('../middleware/userToken.middleware');
const getKeyUser = require('../middleware/microserviceUserGetKey.middleware');

const gameRouter = Router();
const gameService = new GameService();

/**
 * @openapi
 * /api/game/getkey:
 *   get:
 *     summary: Retrieve a satus code 200 when microServiceGame app is run
 *     description: Retrieve a satus code 200 when microServiceGame app is run
 */
gameRouter.get('/getkey', async (request, response) => {
    response.sendStatus(200);
})

/**
 * @openapi
 * /api/game/:gameID:
 *   get:
 *     summary: Retrieve a game of game
 *     description: Retrieve a game of game
 */
 gameRouter.get('/:gameID',getKeyUser,userToken, async (request, response) => {
    console.log("GET GAME");
    response.json(await gameService.getGame(request.params.gameID));
})

/**
 * @openapi
 * /api/game/user/:userID:
 *   get:
 *     summary: Retrieve a game of user
 *     description: Retrieve a game of user
 */
gameRouter.get('/user/:userID',getKeyUser,userToken, async (request, response) => {
    response.json(await gameService.getGamesOfUser(request.params.userID));
})

/**
 * @openapi
 * /api/game/category/:categoryID:
 *   get:
 *     summary: Retrieve a game of category
 *     description: Retrieve a game of category
 */
gameRouter.get('/category/:categoryID',getKeyUser,userToken, async (request, response) => {
    response.json(await gameService.getGamesOfCategory(request.params.categoryID));
})

/**
 * @openapi
 * /api/game:
 *   post:
 *     summary: Create a new game
 *     description: create a new game
 */
gameRouter.post('/',getKeyUser,userToken, (request, response) => {
    const body: { idUser: string, difficulty: number, numberQuestions: number, idCategory: string, name: string } = {
        ...request.body
    };
    gameService.createGame(body.idUser, body.difficulty, body.numberQuestions, body.idCategory, body.name).then((game: GameModel) => {
        response.json(game)
    });
})

/**
 * @openapi
 * /api/game/:userID:
 *   patch:
 *     summary: Update a game
 *     description: Update a game
 */
gameRouter.patch('/:gameID',getKeyUser,userToken, async (request, response) => {
    response.json(await gameService.playGame(request.params.gameID, request.body.answer));
})

/**
 * @openapi
 * /api/game/:gameID:
 *   delete:
 *     summary: Delete a game
 *     description: Delete a game
 */
gameRouter.delete('/:gameID',getKeyUser,userToken, async (request, response) => {
    response.sendStatus(await gameService.deleteGame(request.params.gameID));
})

export default gameRouter;