import { GameService } from "../services/game.services";

const amqplib = require("amqplib");

const MAIN_QUEUE_GAME = "playGame";


const gameService = new GameService();

const processTransaction = (msg: { content: { toString: () => any; }; }) => {
    console.log(` [${MAIN_QUEUE_GAME}] Received '%s'`, msg.content.toString());

    const game = JSON.parse(msg.content.toString());

    gameService.playGame(game.gameID,game.answer);

}

const start = () => {
    console.log('Lancement Notifier Parti')
    amqplib.connect('amqp://localhost').then((conn: { close: () => void; createChannel: () => Promise<any>; }) => {
        process.once('SIGINT', () => { conn.close(); });
        return conn.createChannel().then((ch) => {

            let ok = ch.assertQueue(MAIN_QUEUE_GAME, { durable: false });

            ok = ok.then((_qok: any) => {
                return ch.consume(MAIN_QUEUE_GAME, processTransaction, { noAck: true });
            });

            return ok.then((_consumeOk: any) => {
                console.log(` [${MAIN_QUEUE_GAME}] Waiting for messages. To exit press CTRL+C`);
            });
        });
    }).catch(console.warn);
}

module.exports = () => {
    start();
}
