import { Router } from 'express';
import { PartieService } from '../services/partie.agent.services';

const notifier = require('../notifier/partie.notifier')
notifier();

const agentPartie = Router();
const agentService = new PartieService();

agentPartie.get('/', (request, response) => {
    agentService.publish();
    response.json({ok:'ok'})
})

export default agentPartie;