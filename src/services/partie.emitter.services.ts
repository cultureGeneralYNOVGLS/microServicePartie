const amqplib = require("amqplib");

const MAIN_QUEUE_GAME = "playGame"


export class PartieService {
    sendAnswer(gameID: string, answer: string) {
        amqplib.connect('amqp://localhost').then((conn: { createChannel: () => Promise<any>; close: () => void; }) => {
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


/*

async createGame // NB: `sentToQueue` and `publish` both return a boolean
        (idUser: string, difficulty: number, numberQuestions: number, idCategory: string, name: string): Promise<any> {


        const promise = new Promise((resolve, reject) => {
            amqplib.connect('amqp://localhost').then((conn: { createChannel: () => Promise<any>; close: () => void; }) => {
                return conn.createChannel().then((ch: { assertQueue: (arg0: string, arg1: { durable: boolean; }) => any; sendToQueue: (arg0: string, arg1: Buffer) => void; close: () => any; }) => {
                    const q = 'createGame';
                    const game = {
                        idUser: idUser,
                        difficulty: difficulty,
                        numberQuestions: numberQuestions,
                        idCategory: idCategory,
                        name: name,
                        _id: new ObjectId()
                    }

                    const ok = ch.assertQueue(q, { durable: false });

                    return ok.then((_qok: any) => {

                        ch.sendToQueue(q, Buffer.from(JSON.stringify(game)));
                        console.log(" [x] Sent '%s'", JSON.stringify(game));

                        // Attente de notifier

                        return ch.close();
                    });
                }).finally(() => {

                    conn.createChannel().then((ch) => {


                        let ok = ch.assertQueue(CREATED_QUEUE_TITLE, { durable: false });

                        ok = ok.then((_qok: any) => {
                            ch.consume(CREATED_QUEUE_TITLE, (msg: { content: { toString: () => any; }; }) => {
                                resolve(JSON.parse(msg.content.toString()));
                                conn.close();
                            }, {
                                noAck: true
                            });
                        });

                    });
                });
            }).catch(console.warn);
        });

        return promise;
    }

*/


    public publish() {
        amqplib.connect('amqp://localhost').then((conn: { createChannel: () => Promise<any>; close: () => void; }) => {
            return conn.createChannel().then((ch: { assertQueue: (arg0: string, arg1: { durable: boolean; }) => any; sendToQueue: (arg0: string, arg1: Buffer) => void; close: () => any; }) => {
                const q = 'transactions';
                const isCorrupted = Math.random() < 0.1;
                const accountIndex = Math.floor(Math.random() * 99)
                const transaction = {
                    account_num :"22",
                    timestamp : Date.now(),
                    transactionId : 'sdqsddqsqds',
                    amount : isCorrupted ? -1 : Math.floor(Math.random() * (10000 +2 +1)) -2
                }

                const ok = ch.assertQueue(q, { durable: false });

                return ok.then((_qok: any)  =>{
                    // NB: `sentToQueue` and `publish` both return a boolean
                    // indicating whether it's OK to send again straight away, or
                    // (when `false`) that you should wait for the event `'drain'`
                    // to fire before writing again. We're just doing the one write,
                    // so we'll ignore it.
                    ch.sendToQueue(q, Buffer.from(JSON.stringify(transaction)));
                    console.log(" [x] Sent '%s'", JSON.stringify(transaction));
                    return ch.close();
                });
            }).finally(() => { conn.close(); });
        }).catch(console.warn);
    }

}