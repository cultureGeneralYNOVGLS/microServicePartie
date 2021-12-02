const amqplib = require("amqplib");

const MAIN_QUEUE_GAME = "playGame"

export class PartieService {
    sendAnswer(gameID: string, answer: string) {
        amqplib.connect('amqp://rabbitmq').then((conn: { createChannel: () => Promise<any>; close: () => void; }) => {
            return conn.createChannel().then((ch: { assertQueue: (arg0: string, arg1: { durable: boolean; }) => any; sendToQueue: (arg0: string, arg1: Buffer) => void; close: () => any; }) => {
                const game = {
                    gameID,
                    answer
                }
                const ok = ch.assertQueue(MAIN_QUEUE_GAME, { durable: false });

                return ok.then((_qok: any) => {
                    ch.sendToQueue(MAIN_QUEUE_GAME, Buffer.from(JSON.stringify(game)));
                    console.log(` [${MAIN_QUEUE_GAME}] Sent '%s'`, JSON.stringify(game));
                    return ch.close();
                });
            }).finally(() => {
                conn.close();
            });
        }).catch(console.warn);
    }
}