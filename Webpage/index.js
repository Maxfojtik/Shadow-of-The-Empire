
/*
Player cards
Mission List
Actions
Notes

*/

var cookies = new CookieMonster()
var connection = new BackendConnection()

// Whether this client is the host
var selfIsHost

var numPlayers
var numRolesSelected

const States = {
	MAIN_MENU: "InMainMenu",
	LOBBY: "InLobby",
	GAME: "InGame"
};

const Roles = {
	GOOD: "GoodGuy",
	BAD: "BadGuy",
	MERLIN: "Merlin",
	PERCIVAL: "Percival",
	MORGANA: "Morgana",
	MORDRED: "Mordred",
	ASSASSIN: "Assassin",
	OBERON: "Oberon"
}

function roleIsGood(role) {
	return [Roles.GOOD, Roles.MERLIN, Roles.PERCIVAL]
}

function setState(state) {
	if($('#connecting-screen:hidden').length == 0)
	{
		$('#connecting-screen').find("h2").text("Connected.");
		$('#connecting-screen').fadeTo(100, 0, function() { $('#connecting-screen').hide(); $('#error-screen').hide()});
	}
	if($('#lobby-screen:hidden').length == 0)
	{
		$('#lobby-screen').fadeTo(100, 0);
	}
	if($('#game-screen:hidden').length == 0)
	{
		$('#game-screen').fadeTo(100, 0);
	}
	console.log($('#main-menu-screen:hidden').length == 1);
	if($('#main-menu-screen:hidden').length == 0)
	{
		$('#main-menu-screen').fadeTo(100, 0);
	}
	setTimeout(function() { setStateFinal(state) }, 100);
}
function setStateFinal(state) {
	console.log("show");
	switch (state) {
		case States.MAIN_MENU:
			$('#lobby-screen').hide();
			$('#game-screen').hide();
			$('#main-menu-screen').fadeTo(300, 1)
			clearMainMenu();
			// Clear join game text box and remove room parameter from url
			break;
		case States.LOBBY:
			$('#main-menu-screen').hide();
			$('#game-screen').hide();
			$('#lobby-screen').fadeTo(300, 1)
			clearLobby();
			populateLobby();
			break;
		case States.GAME:
			$('#main-menu-screen').hide();
			$('#lobby-screen').hide();
			$('#game-screen').fadeTo(300, 1)
			clearGame();
			break;
	}
}

function clearMainMenu() {
	console.log("making main menu")
	$("#input-game-code").val("")
	$("#input-game-code").focus()
	$("#join-game-button").prop("disabled", "disabled");
	window.history.replaceState(null, null, window.location.pathname);
}

// Joins a game from the start page. Will need to find the room code
function joinGame() {
	gameId = $("#input-game-code").val().toUpperCase()
	connection.sendJoinGame(gameId);
}
// Asks server for a room code and then server will have us join game
function createGame() {
	connection.sendCreateGame();
}
// Called when connecting to game lobby. Called by backend
function setGameId(gameId) {
	window.history.replaceState(null, null, "?room="+gameId);
	$("#lobby-id").text(gameId)
	$("#lobby-link").text(window.location)
}

// To be called after validating text string in on input for game lobby join text input
function postCheckedLobbyOpen(isOpen) {
	if (isOpen) {
		$("#join-game-button").removeAttr('disabled')
	}
	else {
		$("#join-game-button").prop("disabled", "disabled");
	}
}

function clearLobby() {
	$("lobby-player-list").empty();
}
function populateLobby() {
	$("#input-name-lobby").val(cookies.getPlayerName())
	$("#input-name-lobby").focus()
}
// Changes the display for the player's name
function changePlayerNameLobby(sessionId, newName) {
	console.log(sessionId)
	var playerCard = $(".player-card[data-session-id="+sessionId+"]");
	playerCard.children().first().text(newName)
}

function remakePlayerCards(players) { // [id1, name1, id2, name2, ...]
	selfIsHost = players[0] == cookies.sessionId
	numPlayers = players.length / 2
	$("#lobby-player-list").empty()
	for (var i=0; i<players.length; i+=2) {
		addPlayerToLobby(players[i], players[i+1], i===0)
	}
}
function addPlayerToLobby(sessionId, name, isHost) {
	var newPlayerCard = document.createElement('div');
	newPlayerCard.setAttribute('class', 'player-card');
	newPlayerCard.setAttribute('data-session-id', sessionId);

	var playerName = document.createElement('span');
	playerName.appendChild(document.createTextNode(name));
	newPlayerCard.appendChild(playerName);

	var kickIcon = document.createElement('img'); 
  kickIcon.src = "Images/kick.png";
  kickIcon.classList.add("icon")
  if (!isHost && selfIsHost)
  	kickIcon.classList.add("icon-fade");
  else
	  kickIcon.classList.add("icon-hidden");
	kickIcon.onclick = function() { connection.sendKick(sessionId) };
	newPlayerCard.appendChild(kickIcon);

  var hostIcon = document.createElement('img'); 
  hostIcon.src = "Images/crown.png";
  hostIcon.classList.add("icon")
  if (!isHost && selfIsHost)
  	hostIcon.classList.add("icon-fade");
  else if (!isHost)
	  hostIcon.classList.add("icon-hidden");
	hostIcon.onclick = function() { connection.sendPromote(sessionId) };
	newPlayerCard.appendChild(hostIcon);

	$('#lobby-player-list').append(newPlayerCard);
}

function adjustRoleAmount(role, adjustBy) {
	console.log("Adjusting "+role+" by "+adjustBy);
	newCount = parseInt($("#role-count-"+role).text()) + adjustBy;
	updateRoleAmount(role, newCount)
	connection.setRoleCount(role, newCount)
}
function updateAllRoleAmounts(roles) { // [role1, count1, role2, count2...]
	numRolesSelected = roles.length / 2
	for (var i=0; i<roles.length; i+=2) {
		updateRoleAmount(roles[i], roles[i+1])
	}
}
function updateRoleAmount(role, count) {
	numRolesSelected += count
	$("#role-count-"+role).text(count)
}

function checkStartGameButton() {
	if (numRolesSelected >= 3)
		return true
	else
		return false
}

function clearGame() {
	
}

function populateGame(myRole, players, roles) {
	createPlayerGameCards(players)
	fillGameInfo(myRole, roles)
}

function createPlayerGameCards(players) {
	var newPlayerCard = document.createElement('div');
	newPlayerCard.setAttribute('class', 'player-card');
	newPlayerCard.setAttribute('data-session-id', sessionId);

	var playerName = document.createElement('span');
	playerName.appendChild(document.createTextNode(name));
	newPlayerCard.appendChild(playerName);

	$('#game-player-list').append(newPlayerCard);
}

function fillGameInfo(myRole, roles) {

}

$(document).ready(function(){
	// Checks if the room code is valid via string checking and polling server. Enables join button only when valid
	$('#input-game-code').on('input', function() {
		text = $('#input-game-code').val().toUpperCase(); // Get text and make capital
		isValid = (/[A-Z]{4}/).test(text) // Is 4 capital letters
		if (isValid)
			connection.checkLobbyOpen(text) // This will initialize a check with backend, resulting in call to postCheckedLobbyOpen(isOpen)
		else
			$("#join-game-button").prop("disabled", "disabled");
	});
	$('#input-game-code').keypress(function (e) {
		console.log(e.which)
		if(e.which == 13)  // the enter key code
			$('#join-game-button').click();
	});

	$('#input-name-lobby').on('input', function() {
		var name = $('#input-name-lobby').val()
		changePlayerNameLobby(cookies.sessionId, name);
		connection.sendUpdateName(name)
		cookies.setPlayerName(name)
	});

	setTimeout(function(){
		if(!connection.connectionError)
		{
			$("#connecting-screen").addClass('connecting')
			$("#connecting-screen").removeClass('screen')
		}
	}, 1000);
});
