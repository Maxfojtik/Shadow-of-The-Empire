
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
		this.send("PlayerConnect|"+cookies.sessionId+"|"+cookies.getUsername());
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
		if(params[0]=="AcceptSessionID")
		{
			acceptSignIn(params[1]);
		}
		if(params[0]=="DenySessionID")
		{
			denySignIn();
		}
		if(params[0]=="AcceptSignup")
		{
			acceptSignUp();
		}
		if(params[0]=="DenySignup")
		{
			denySignUp();
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
	
	sendSignUp(sessionId)
	{
		this.send("Signup|"+sessionId);
	}
	
	sendSessionId(sessionId)
	{
		this.send("SetSessionId|"+sessionId);
	}
	sendSliders()
	{
		this.send("Sliders");
	}
}