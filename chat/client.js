const dgram = require('dgram');

const client = dgram.createSocket('udp4');

const handlers = {}

exports.on = (action, handler) => {
    Object.defineProperty(
        handlers,
        action,
        {
            value: handler,
            writable: false
        }
    )
}

exports.listen = (port) => {
    client.on('message',  (request, rinfo) => {
        const [action, sender, payload] = [...request.toString().split('/')];
        const handler = handlers[action]
        if (handler) {
            handler(rinfo, sender, payload)
        }
    })
    client.bind(parseInt(port), 'localhost');
}


exports.sendTo = (port, ...args) => {
    client.send(Buffer.from(args.join('/')), port, 'localhost');
}

exports.onClose = () => {
    client.close()
}
