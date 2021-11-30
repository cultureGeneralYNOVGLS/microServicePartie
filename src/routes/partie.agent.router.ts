import { Router } from 'express';
import { PartieService } from '../services/partie.emitter.services';

const userToken = require('../middleware/userToken.middleware');

const notifier = require('../notifier/partie.agent')
notifier();

const agentPartie = Router();
const agentService = new PartieService();

agentPartie.get('/', (request, response) => {
    agentService.publish();
    response.json({ok:'ok'})
})

agentPartie.post('/',userToken, (request, response) => {
    /*const body: { idUser: string, difficulty: number, numberQuestions: number, idCategory: string, name: string } = {
        ...request.body
    };
    gameService.createUser(body.idUser, body.difficulty, body.numberQuestions, body.idCategory, body.name).then((game: GameModel) => {
        response.json(game)
    });*/
    const body: { idUser: string, difficulty: number, numberQuestions: number, idCategory: string, name: string } = {
        ...request.body
    };
    agentService.createGame(body.idUser, body.difficulty, body.numberQuestions, body.idCategory, body.name).then((a) => {
        response.json(a);
    });

})


export default agentPartie;