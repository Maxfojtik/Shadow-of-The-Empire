
// var wsUri = "ws://localhost:12389"; // Localhost
var wsUri = "ws://74.140.3.27:12389"; // Max's

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
		if(params[0]=="LobbyOpen")
		{
			postCheckedLobbyOpen(params[1] == 'true');
		}
		if(params[0]=="GameId")
		{
			setGameId(params[1]);
		}
		if(params[0]=="RedirectToGame")
		{
			setGameId(params[1]);populateGame(myRole, players, roles)
			this.sendJoinGame(params[1]);
		}
		if(params[0]=="UpdatedName")
		{
			changePlayerNameLobby(params[1], params[2]);
		}
		/*if(params[0]=="PlayerJoinedGame")
		{
			addPlayerToLobby(params[1], params[2]);
		}
		if(params[0]=="PlayerLeftGame")
		{
			removePlayerCardLobby(params[1]);
		}*/
		if(params[0]=="Players")
		{
			remakePlayerCards(params.splice(1));
		}
		if(params[0]=="Kicked")
		{
			//getKicked();
		}
		if(params[0]=="GameStartError")
		{
			
		}
		if(params[0]=="AllRoles")
		{
			updateAllRoleAmounts(params.splice(1));
		}
		if(params[0]=="PopulateGame")
		{
			//populateGame(myRole, players, roles);
			populateGame(parmas[1], players, roles);
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
	
	sendCreateGame()
	{
		this.send("CreateGame");
	}
	
	sendUpdateName(newName)
	{
		this.send("UpdateName|"+cookies.sessionId+"|"+newName);
	}
	
	setRoleCount(roleName, number)
	{
		this.send("Admin|"+cookies.sessionId+"|SetRole|"+roleName+"|"+number);
	}
	
	sendKick(targetId)
	{
		this.send("Admin|"+cookies.sessionId+"|Kick|"+targetId);
	}
	
	sendPromote(targetId)
	{
		this.send("Admin|"+cookies.sessionId+"|Promote|"+targetId);
	}
	
	sendStartGame()
	{
		this.send("Admin|"+cookies.sessionId+"|StartGame");
	}
	
	sendLeaveGame()
	{
		this.send("LeaveGame|"+cookies.sessionId);
	}
	
	checkLobbyOpen(gameId)
	{
		this.send("LobbyOpen|"+gameId);
	}
}