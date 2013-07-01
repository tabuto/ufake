var net = require('net');

var chatServer = net.createServer();
var clientList = [];

chatServer.on('connection',function(client) {
	client.name = client.remoteAddress + ':' + client.remotePort;
	client.write('Benvenuto '+client.name +'!\n');
	console.log(client.name + " si e' unito alla chat");
	clientList.push(client);
	
	
	client.on('data', function(data) {
		broadcast(data, client);	
	});
	
	client.on('end', function() {
		console.log(client.name + " ha lasciato la chat");
		clientList.splice(clientList.indexOf(client), 1);
	});
	
	client.on('error', function(e) {
		console.log(e);
	});
	
});

function broadcast(message, client) {
	
	var cleanup = [];
	
	for(var i=0; i<clientList.length;i++) {
		if(client != clientList[i]) {
			
			if(clientList[i].writable) {
				clientList[i].write(client.name + " dice:"+message);
			} else {
				cleanup.push(clientList[i]);
				clientList[i].destroy();
				
			}
		}
	}
	
	//elimino i nodi morti - socket chiusi
	for(i=0; i<cleanup.length;i++) {
		clientList.splice(clientList.indexOf(cleanup[i]),1);
		
	}
}
chatServer.listen(9000);
console.log("Server in ascolto sulla porta 9000");