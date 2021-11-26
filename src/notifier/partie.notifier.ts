const amqplib = require("amqplib");

const MAIL_QUEUE_TITLE = "transactions";

const start = () => {
    console.log('Lancement Notifier Parti')
    amqplib.connect('amqp://localhost').then((conn: { close: () => void; createChannel: () => Promise<any>; }) => {
        process.once('SIGINT', () => { conn.close(); });
        return conn.createChannel().then((ch) => {

            var ok = ch.assertQueue(MAIL_QUEUE_TITLE, { durable: false });

            ok = ok.then((_qok: any) => {
                return ch.consume(MAIL_QUEUE_TITLE, processTransaction, { noAck: true });
            });

            return ok.then((_consumeOk: any) => {
                console.log(` [${MAIL_QUEUE_TITLE}] Waiting for messages. To exit press CTRL+C`);
            });


            const processTransaction = (msg: { content: { toString: () => any; }; }) => {
                console.log(` [${MAIL_QUEUE_TITLE}] Received '%s'`, msg.content.toString());
            }
        });
    }).catch(console.warn);
}

module.exports = () => {
    start();
}
