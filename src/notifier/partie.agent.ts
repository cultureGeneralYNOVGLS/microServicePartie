const amqplib = require("amqplib");

const MAIL_QUEUE_TITLE = "createGame";
const CREATED_QUEUE_TITLE = "createdGame";
import { GameModel } from '../models/game.model';
import { GameService } from '../services/game.services';
import { ObjectId } from "bson";
const gameService = new GameService();


const processTransaction = (msg: { content: { toString: () => any; }; }) => {
    console.log(` [${MAIL_QUEUE_TITLE}] Received '%s'`, msg.content.toString());
    const gameP = JSON.parse(msg.content.toString());
    
    gameService.createGame(gameP.idUser, gameP.difficulty, gameP.numberQuestions, gameP.idCategory, gameP.name, new ObjectId(gameP._id)).then((game: GameModel) => {
        // Autre send RabbitmQ
        amqplib.connect('amqp://localhost').then((conn: { createChannel: () => Promise<any>; close: () => void; }) => {
            return conn.createChannel().then((ch: { assertQueue: (arg0: string, arg1: { durable: boolean; }) => any; sendToQueue: (arg0: string, arg1: Buffer) => void; close: () => any; }) => {
                const q = CREATED_QUEUE_TITLE;


                const ok = ch.assertQueue(q, { durable: false });

                return ok.then((_qok: any) => {
                    // NB: `sentToQueue` and `publish` both return a boolean
                    // indicating whether it's OK to send again straight away, or
                    // (when `false`) that you should wait for the event `'drain'`
                    // to fire before writing again. We're just doing the one write,
                    // so we'll ignore it.
                    ch.sendToQueue(q, Buffer.from(JSON.stringify(game)));
                    console.log(` [${CREATED_QUEUE_TITLE}] Sent '%s'`, JSON.stringify(game));
                    return ch.close();
                });
            }).finally(() => { conn.close(); });
        }).catch(console.warn);

    })


}

const start = () => {
    console.log('Lancement Notifier Parti')
    amqplib.connect('amqp://localhost').then((conn: { close: () => void; createChannel: () => Promise<any>; }) => {
        process.once('SIGINT', () => { conn.close(); });
        return conn.createChannel().then((ch) => {

            let ok = ch.assertQueue(MAIL_QUEUE_TITLE, { durable: false });

            ok = ok.then((_qok: any) => {
                return ch.consume(MAIL_QUEUE_TITLE, processTransaction, { noAck: true });
            });

            return ok.then((_consumeOk: any) => {
                console.log(` [${MAIL_QUEUE_TITLE}] Waiting for messages. To exit press CTRL+C`);
            });
        });
    }).catch(console.warn);
}

module.exports = () => {
    start();
}
