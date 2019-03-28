const amqp = require('amqplib/callback_api');

const publisher = function publisher(email) {
  amqp.connect(`amqp://${process.env.SERVER_QUEUE}`, (err, conn) => {
        if(err) {
            console.err(err)
            throw new Error(err)
        }

        conn.createChannel((err, ch) => {
            
            if(err) {
                console.err(err)
                throw new Error(err)
            }

            const queue = process.env.SERVER_NAME_QUEUE

            ch.assertQueue(queue, {durable: false})

            ch.sendToQueue(queue, new Buffer.from(JSON.stringify(email)))
        })

        setTimeout(() => { conn.close() }, 500);
    })  
}

module.exports = publisher