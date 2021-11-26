const amqplib = require("amqplib");

export class PartieService {
    
    public publish() {
        amqplib.connect('amqp://localhost').then((conn: { createChannel: () => Promise<any>; close: () => void; }) => {
            return conn.createChannel().then((ch: { assertQueue: (arg0: string, arg1: { durable: boolean; }) => any; sendToQueue: (arg0: string, arg1: Buffer) => void; close: () => any; }) => {
                var q = 'transactions';
                let isCorrupted = Math.random() < 0.1;
                let accountIndex = Math.floor(Math.random() * 99)
                let transaction = {
                    account_num :"22",
                    timestamp : Date.now(),
                    transactionId : 'sdqsddqsqds',
                    amount : isCorrupted ? -1 : Math.floor(Math.random() * (10000 +2 +1)) -2
                }

                var ok = ch.assertQueue(q, { durable: false });

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