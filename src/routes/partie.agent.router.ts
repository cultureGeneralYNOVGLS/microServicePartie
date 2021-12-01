import { Router } from 'express';
import { PartieService } from '../services/partie.emitter.services';


const userToken = require('../middleware/userToken.middleware');
const getKeyUser = require('../middleware/microserviceUserGetKey.middleware');

const notifier = require('../notifier/partie.agent')
notifier();

const agentPartie = Router();
const agentService = new PartieService();

agentPartie.get('/', (request, response) => {
    agentService.publish();
    response.json({ok:'ok'})
})

agentPartie.patch('/:gameID',getKeyUser,userToken, async (request, response) => {
    agentService.sendAnswer(request.params.gameID, request.body.answer);
    response.sendStatus(200);
})

export default agentPartie;