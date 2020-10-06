
// var wsUri = "ws://localhost:12389"; // Localhost
var wsUri = "ws://74.140.3.27:12398"; // Max's

class BackendConnection {
	constructor() {
		this.connectionError = false;
		this.websocket = new WebSocket(wsUri);
		var self = this;
		this.websocket.onopen = function(evt) { self.onOpen(evt) };
		this.websocket.onclose = function(evt) { self.onClose(evt) };
		this.websocket.onmessage = function(evt) { self.onMessage(evt) };
		this.websocket.onerror = function(evt) { self.onError(evt) };
	}

	onOpen(evt) {
		console.log("CONNECTED");
		this.send("PlayerConnect|"+cookies.sessionId+"|"+cookies.getPlayerName());
	}

	onClose(evt) {
		console.log("DISCONNECTED");
	}

	onMessage(evt) {
		console.log('<-: ' + evt.data);
		var params = evt.data.split("|");
		if(params[0]=="UpdateState")
		{
			setState(params[1]);
		}
		if(params[0]=="SliderValues")
		{
			setSliderValues({"Wealth": parseFloat(params[1]),"Military": parseFloat(params[2]),"Consciousness": parseFloat(params[3]),"Culture": parseFloat(params[4]),"Piety": parseFloat(params[5])});
		}
	}

	onError(evt) {
		console.log('ERROR: ' + evt.type);
		this.connectionError = true;
		$("#connecting-screen").hide();
		$("#error-screen").addClass('connecting');
		$("#error-screen").removeClass('screen');
	}

	send(message) {
		this.websocket.send(message);
		console.log("->: " + message);
	}

	sendJoinGame(gameId)
	{
		this.send("JoinGame|"+cookies.sessionId+"|"+gameId);
	}
}