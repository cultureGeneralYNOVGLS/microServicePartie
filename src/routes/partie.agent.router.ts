import { Router } from 'express';
import { PartieService } from '../services/partie.emitter.services';

const userToken = require('../middleware/userToken.middleware');
const getKeyUser = require('../middleware/microserviceUserGetKey.middleware');

const notifier = require('../notifier/partie.agent')
notifier();

const agentPartie = Router();
const agentService = new PartieService();

/**
 * @openapi
 * /api/game/agent/:gameID:
 *   patch:
 *     summary: Update a game when received message of rabbitMQ
 *     description: Update a game when received message of rabbitMQ
 */
agentPartie.patch('/:gameID',getKeyUser,userToken, async (request, response) => {
    agentService.sendAnswer(request.params.gameID, request.body.answer);
    response.sendStatus(200);
})

export default agentPartie;