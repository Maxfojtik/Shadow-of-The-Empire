
class CookieMonster {

	constructor() {
		
		if (localStorage.sessionId && localStorage.sessionId != "undefined") {
			this.sessionId = localStorage.sessionId;
		}
		else {
			this.sessionId = generateSessionID();
			localStorage.sessionId = this.sessionId;
		}

	}

	setPlayerName(name) {
		localStorage.playerName = name;
	}
	getPlayerName() {
		if (localStorage.playerName == undefined)
			return "???"
		else
			return localStorage.playerName; 
	}

}
