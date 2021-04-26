const readline = require('readline');
const crypto = require('crypto');
const Client = require('./client');


const state = {
    currentUser: '',
    history: {},
    companionPort: 0,
    companionName: '',
    currentHistory: null,
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>> '
});



Client.on('message', (rinfo, sender, payload) => {
    const [message, owner] = [...payload.split(':')]

    state.history[generateHash([state.currentUser, sender])].push([owner, message]);
    if (state.companionName === sender) {
        rl.print(`${owner}: ${message}`);
    }
})

Client.on('check', (rinfo, sender, payload) => {
    Client.sendTo(rinfo.port, 'connect', state.currentUser === sender)
    if (state.currentUser === sender) {
        ensureCreateProperty(state.history, generateHash([state.currentUser, payload]), [])

        let hash = generateHash([state.currentUser, state.companionName]);
        const history = state.history[hash]
        if (history) {
            history.forEach(i => { Client.sendTo(rinfo.port, 'message', state.currentUser, `${i[1]}:${i[0]}`) })
        }
    }
})

Client.on('connect', (rinfo, sender, payload) => {
    if (sender === 'true') {
        let hash = generateHash([state.currentUser, state.companionName]);
        ensureCreateProperty(state.history, hash, []);        
        state.companionPort = rinfo.port;
        rl.print('---connected---')
    }
    else {
        rl.print('---connection failed---')
    }

    rl.prompt();
})



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
            state.client.close();
            break;
        case 'disconnect':
            state.companionName = '';
            state.companionPort = 0;
            break;
        case 'connect':
            connectToUser();
            break;
        default:
            let hash = generateHash([state.currentUser, state.companionName]);
            state.history[hash].push([state.currentUser, line]);
            Client.sendTo(state.companionPort, 'message', state.currentUser, `${line}:${state.currentUser}`)
            break;
    }
    rl.prompt();
}).on('close', () => {
    Client.onClose()
    process.exit(0);
});



function login() {
    rl.question('userName: ', (name) => {
        rl.question('port: ', (port) => {
            state.currentUser = name;
            Client.listen(port)
            rl.prompt();
        })
    })
}

function connectToUser() {
    rl.question('name: ', (name) => {
        rl.question('port: ', (port) => {
            state.companionName = name;
            Client.sendTo(port, 'check', name, state.currentUser)
            rl.prompt();
        })
    })
}


function ensureCreateProperty(obj, prop, create) {
    if (!obj.hasOwnProperty(prop)) {
        obj[prop] = create;
    }
}


function generateHash(arr) {
    const hash = (str) => crypto.createHash('md5').update(str).digest("hex");

    const strOne = hash(arr[0]);
    const strTwo = hash(arr[1]);

    let res = ''

    for(let i = 0; i < strOne.length; i++) {
        res += String.fromCharCode(strOne[i].charCodeAt(0).toString(8) ^ strTwo[i].charCodeAt(0).toString(8));
    }

    return res;
}