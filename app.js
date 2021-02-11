const dgram = require('dgram');
const readline = require('readline');
const crypto = require('crypto');


const Actions = {
    message: 'message',
    connect: 'connect',
    check: 'check',
    remove: 'remove'
};

const state = {
    currentUser: '',
    history: {},
    companionPort: 0,
    companionName: '',
    currentHistory: null,
    messenger: false,
    client: null
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>> '
});

rl.print = (line) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(line);
    rl.prompt();
}

rl.prompt()

rl.on('line', (line) => {
    switch (line.trim()) {
        case 'login':
            login();
            break;
        case 'logout':
            state.currentUser = '';
            state.companionName = '';
            state.companionPort = 0;
            state.messenger = false;
            state.client.close();
            break;
        case 'disconnect':
            state.companionName = '';
            state.companionPort = 0;
            state.messenger = false;
            break;
        case 'connect':
            connectToUser();
            break;
        case 'messenger':
            if (state.companionPort) {
                state.messenger = true;
                let hash = generateHash([state.currentUser, state.companionName]);
                state.history[hash].forEach(i => {
                    if (i[0] === state.currentUser) {
                        rl.prompt();
                        console.log(i[1]);
                    }
                    else {
                        console.log(`${i[0]}: ${i[1]}`);
                    }
                })
            }
            break;
        default:
            if (state.messenger) {
                let hash = generateHash([state.currentUser, state.companionName]);
                state.history[hash].push([state.currentUser, line]);
                sendToClient(state.companionPort, Actions.message, state.currentUser, line);
            }
            else {
                console.log(`Say what? I might have heard '${line.trim()}'`);
            }
            break;
    }
    rl.prompt();
}).on('close', () => {
    state.client.close();
    process.exit(0);
});



function login() {
    rl.question('userName: ', (name) => {
        rl.question('port: ', (port) => {
            state.currentUser = name;
            state.client = createClient(port);
            rl.prompt();
        })
    })
}

function connectToUser() {
    rl.question('name: ', (name) => {
        rl.question('port: ', (port) => {
            state.companionName = name;
            sendToClient(port, Actions.check, name, state.currentUser);
            rl.prompt();
        })
    })
}



function sendToClient(port, ...args) {
    state.client.send(Buffer.from(args.join('/')), port, 'localhost');
}


function createClient(port) {
    let client = dgram.createSocket('udp4');
    client.on('message', (msg, rinfo) => {
        let data = msg.toString().split('/');

        if (data[0] === Actions.message && state.currentUser) {
            state.history[generateHash([state.currentUser, data[1]])].push([data[1], data[2]]);
            if (state.companionName === data[1]) {
                rl.print(`${data[1]}: ${data[2]}`);
            }
        }
        else if (data[0] === Actions.check) {
            if (state.currentUser === data[1]) {
                ensureCreateProperty(state.history, generateHash([state.currentUser, data[2]]), [])
            }
            sendToClient(rinfo.port, Actions.connect, state.currentUser === data[1]);
        }
        else if (data[0] === Actions.connect) {
            if (data[1] === 'true') {
                let hash = generateHash([state.currentUser, state.companionName]);
                ensureCreateProperty(state.history, hash, []);
                state.companionPort = rinfo.port;
                rl.print('connected')
            }
            else {
                rl.print('connection failed')
            }
            rl.prompt();
        }
    });

    client.bind(parseInt(port), 'localhost');

    return client;
}


function ensureCreateProperty(obj, prop, create) {
    if (!obj.hasOwnProperty(prop)) {
        obj[prop] = create;
    }
}


function generateHash(arr) {
    const hash = (str) => crypto.createHash('md5').update(str).digest("hex");

    let strOne = hash(arr[0]);
    let strTwo = hash(arr[1]);

    let res = ''

    for(let i = 0; i < strOne.length; i++) {
        res += String.fromCharCode(strOne[i].charCodeAt(0).toString(8) ^ strTwo[i].charCodeAt(0).toString(8));
    }

    return res;
}