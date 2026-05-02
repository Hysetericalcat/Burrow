import net from 'node:net';
const client = net.createConnection({
    host: '23.22.129.40',
    port: 9000
})

const httpserver = net.createConnection({
    host: 'localhost', 
    port: 3000
})

//IP address + Port = Socket
//uses streams for transmission 
//EventEmitter class does the net module implementation
//promises -> state ,emitter/listener -> stateless
// send data
//emit is for notifying other parts of your own code that something happened.(local notification) -> for local created custome events
//createconnection -> gives a socket itself
//on('connect') -> measure to ensure connection was established

httpserver.on('connect',()=>{
    httpserver.pipe(client)
})

client.on('connect', () => {
    client.pipe(httpserver)
})


client.on('end', () => {
    console.log('disconnected from server');
  });

