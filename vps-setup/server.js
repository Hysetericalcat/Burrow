import net from 'node:net';


//IP address + Port = Socket
//uses streams for transmission 
//EventEmitter class does the net module implementation
//promises -> state ,emitter/listener -> stateless

const publicServer = net.createServer()  // port 8080
const tunnelServer = net.createServer() // port 9000
//pipe -> triggers the 'data' event underneath ...pipe transfers every byte coming from the socket to other socket
let tunnelSocket = null

tunnelServer.on('connection', (socket) => {
    tunnelSocket = socket
})

publicServer.on('connection', (socket) => {
    if (!tunnelSocket) {
        socket.end('No tunnel connected')
        return
    }
    socket.pipe(tunnelSocket)
    tunnelSocket.pipe(socket)
})

tunnelServer.listen(9000,()=>{
    console.log("TCP tunnel server is listening on port 9000")
})

publicServer.listen(8080,()=>{
    console.log("TCP public server is listening on port 8080")
})