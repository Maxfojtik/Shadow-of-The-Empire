
// var wsUri = "ws://localhost:12389"; // Localhost
var wsUri = "ws://134.228.155.169:12398"; // Max's

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
		$("#error-screen").hide();
		if (cookies.hasLoginCred()) {
			this.sendSessionId(cookies.getUsername()+"|"+cookies.getPassword());
		}
	}

	onClose(evt) {
		console.log("DISCONNECTED");
    	location.reload();
	}

	onMessage(evt) {
		console.log('<-: ' + evt.data);
		var params = evt.data.split("|");
		if(params[0]=="SliderValues")
		{
			setSliderValues({"Wealth": parseFloat(params[1]),"Military": parseFloat(params[2]),"Consciousness": parseFloat(params[3]),"Culture": parseFloat(params[4]),"Piety": parseFloat(params[5])});
		}
		if(params[0]=="AcceptSessionID")
		{
			acceptSignIn(params[1], params[2], params[3], params[4]);
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
			denySignUp(params[1]);
		}
		if(params[0]=="Error")
		{
			somethingWentWrong(params[1]);
		}
		if(params[0]=="Problems")
		{
			populateUserProblemsPhase(params[1]);
		}
		if(params[0]=="SolutionProposed")
		{
			addProposedSolution(parseInt(params[1]), params[2], params[3], [], params[4]);//title, text
		}
		if(params[0]=="SignedFor")
		{
			signedFor(parseInt(params[1]), parseInt(params[2]), params[3])//problem number, solution number, names
		}
		if(params[0]=="PopulateUserVotingPhase")
		{
			populateUserVotingPhase(params[1]);
		}
		if(params[0]=="VotedFor")
		{
			votedFor(parseInt(params[1]), parseInt(params[2]), params[3]);
		}
		if(params[0]=="Message")
		{
			alert(params[1]);
		}
		if(params[0]=="SignupsDisabled")
		{
			signupsDisabled();
		}
	}

	onError(evt) {
		console.log('ERROR: ' + evt.type);
		this.connectionError = true;
		$("#error-screen").show();
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
	sendSetSlider(slider, value)
	{
		this.send("SetSlider|"+cookies.getSessionId()+"|"+slider+"|"+value);
	}
	changeToProblemPhase(jsonText)
	{
		this.send("ChangeToProblemPhase|"+cookies.getSessionId()+"|"+jsonText);
	}
	changeToVotingPhase()
	{
		this.send("ChangeToVotingPhase|"+cookies.getSessionId());
	}
	proposeSolution(problem, solutionTitle, solutionText)
	{
		solutionText = solutionText.replace("|","");
		this.send("ProposeSolution|"+cookies.getSessionId()+"|"+problem+"|"+solutionTitle+"|"+solutionText);
	}
	signFor(problem, solutionNumber)
	{
		this.send("Sign|"+cookies.getSessionId()+"|"+problem+"|"+solutionNumber);
	}
	signntFor(problem, solutionNumber)
	{
		this.send("Signnt|"+cookies.getSessionId()+"|"+problem+"|"+solutionNumber);
	}
	toggleVote(problem, solutionNumber)
	{
		this.send("ToggleVote|"+cookies.getSessionId()+"|"+problem+"|"+solutionNumber);
	}
	lockSignups()
	{
		this.send("Lock|"+cookies.getSessionId());
	}
}
