import { ObjectId } from "bson";
import { GameModel } from "../models/game.model";

const amqplib = require("amqplib");

const CREATED_QUEUE_TITLE = "createdGame";

export class PartieService {
    async createGame // NB: `sentToQueue` and `publish` both return a boolean
        (idUser: string, difficulty: number, numberQuestions: number, idCategory: string, name: string): Promise<any> {


        let promise = new Promise((resolve, reject) => {
            amqplib.connect('amqp://localhost').then((conn: { createChannel: () => Promise<any>; close: () => void; }) => {
                return conn.createChannel().then((ch: { assertQueue: (arg0: string, arg1: { durable: boolean; }) => any; sendToQueue: (arg0: string, arg1: Buffer) => void; close: () => any; }) => {
                    const q = 'createGame';
                    const game = {
                        idUser,
                        difficulty,
                        numberQuestions,
                        idCategory,
                        name,
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

                        ch.consume(CREATED_QUEUE_TITLE, (msg: { content: { toString: () => any; }; }) => {
                            resolve(JSON.parse(msg.content.toString()));
                        }, {
                            noAck: true
                        });
                    });
                });
            }).catch(console.warn);
        });

        return promise;
    }

    public publish() {
        amqplib.connect('amqp://localhost').then((conn: { createChannel: () => Promise<any>; close: () => void; }) => {
            return conn.createChannel().then((ch: { assertQueue: (arg0: string, arg1: { durable: boolean; }) => any; sendToQueue: (arg0: string, arg1: Buffer) => void; close: () => any; }) => {
                const q = 'transactions';
                const isCorrupted = Math.random() < 0.1;
                const accountIndex = Math.floor(Math.random() * 99)
                const transaction = {
                    account_num: "22",
                    timestamp: Date.now(),
                    transactionId: 'sdqsddqsqds',
                    amount: isCorrupted ? -1 : Math.floor(Math.random() * (10000 + 2 + 1)) - 2
                }

                const ok = ch.assertQueue(q, { durable: false });

                return ok.then((_qok: any) => {
                    // NB: `sentToQueue` and `publish` both return a boolean
                    // indicating whether it's OK to send again straight away, or
                    // (when `false`) that you should wait for the event `'drain'`
                    // to fire before writing again. We're just doing the one write,
                    // so we'll ignore it.
                    ch.sendToQueue(q, Buffer.from(JSON.stringify(transaction)));
                    console.log(" [x] Sent '%s'", JSON.stringify(transaction));

                    // Attente de notifier

                    return ch.close();
                });
            }).finally(() => { conn.close(); });
        }).catch(console.warn);
    }

}