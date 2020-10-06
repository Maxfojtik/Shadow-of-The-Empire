var cookies = new CookieMonster()
var connection = new BackendConnection()

const States = {
	SLIDERS: "InSliders",
	LOGGING_IN: "LoggingIn",
	SEEING_PROPOSALS: "SeeingProposals",
	VOTING_PROPOSALS: "VotingProposals",
	ADMIN: "Admin"
};

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
		case States.SLIDERS:
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


$(document).ready(function(){
	setTimeout(function(){
		if(!connection.connectionError)
		{
			$("#connecting-screen").addClass('connecting')
			$("#connecting-screen").removeClass('screen')
		}
	}, 1000);
});