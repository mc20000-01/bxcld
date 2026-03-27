const url = "wss://bxcld.sdisk.us";

const connectButton = document.getElementById("connectButton");
const keyInput = document.getElementById("keyInput");
const codeInput = document.getElementById("codeInput");
const runButton = document.getElementById("runButton");

const output = document.getElementById("codeOutput");

function saveKey() {
    const key = keyInput.value
    const socket = new WebSocket(url);
    const check = {
        "key": key
    };
    socket.onopen = function(e) {
        socket.send(JSON.stringify(check))
        socket.onmessage = function(e) {
            const resp = JSON.(e)
            console.log(resp)
            if (resp == "auth_ok") {
                keyInput.disabled =true
            }
        }
    }
};

function startCloudInstance() {
    output.value = ""
    const key = keyInput.value;
    const code = codeInput.value.replace("\n", " /n ");
    const socket = new WebSocket(url);
    const payload = {
        "name": "web.bx",  // just bc it is running from the web and has no real
        "data": code,
        "key": key
    };
    
    socket.onopen = function(e) {
        socket.send(JSON.stringify(payload));
    };

    socket.onmessage = async function(e) {
        const data = JSON.parse(e.data);
        if (data.cmd == "ask") {
            response = window.prompt(data.ask);
            output.value = output.value + data.ask + ": " + response + "\n";
            toSend = {"data": response} ;
            socket.send(JSON.stringify(toSend));
        };
        if (data.cmd == "say") {
            output.value = output.value + data.say + "\n";
        };
    };
};

keyInput.value = "0";
codeInput.value = `
ask what~is~your~name
say hello~$name~how~are~you?|5
math mathed|10|5|*
say $mathed|1

if 77|==|4|say|test|1
`.trim();
runButton.onclick = () => startCloudInstance();
connectButton.onclick = () => saveKey();
console.log(keyInput.disabled)
