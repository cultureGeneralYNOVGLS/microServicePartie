const amqplib = require("amqplib");

const MAIL_QUEUE_TITLE = "transactions";

async function start() {
    console.log('Lancement Notifier Parti')
    amqplib.connect('amqp://localhost').then(function (conn: { close: () => void; createChannel: () => Promise<any>; }) {
        process.once('SIGINT', function () { conn.close(); });
        return conn.createChannel().then(function (ch) {

            var ok = ch.assertQueue(MAIL_QUEUE_TITLE, { durable: false });

            ok = ok.then(function (_qok: any) {
                return ch.consume(MAIL_QUEUE_TITLE, processTransaction, { noAck: true });
            });

            return ok.then(function (_consumeOk: any) {
                console.log(` [${MAIL_QUEUE_TITLE}] Waiting for messages. To exit press CTRL+C`);
            });


            function processTransaction(msg: { content: { toString: () => any; }; }) {
                console.log(` [${MAIL_QUEUE_TITLE}] Received '%s'`, msg.content.toString());
            }
        });
    }).catch(console.warn);
}

module.exports = () => {
    start();
}
