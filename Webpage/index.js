var cookies = new CookieMonster()
var connection = new BackendConnection()

const States = {
	SLIDERS: "InSliders",
	LOGGING_IN: "LoggingIn",
	SEEING_PROPOSALS: "SeeingProposals",
	VOTING_PROPOSALS: "VotingProposals",
	ADMIN: "Admin"
};

var signedIn = false;

function setState(state) {
	if($('#connecting-screen:hidden').length == 0)
	{
		$('#connecting-screen').find("h2").text("Connected.");
		$('#connecting-screen').fadeTo(100, 0, function() { $('#connecting-screen').hide(); $('#error-screen').hide()});
	}
	if($('#sliders-screen:hidden').length == 0)
	{
		$('#sliders-screen').fadeTo(100, 0);
	}
	if($('#login-screen:hidden').length == 0)
	{
		$('#login-screen').fadeTo(100, 0);
	}
	if($('#seeing-proposals-screen:hidden').length == 0)
	{
		$('#seeing-proposals-screen').fadeTo(100, 0);
	}
	if($('#voting-proposals-screen:hidden').length == 0)
	{
		$('#voting-proposals-screen').fadeTo(100, 0);
	}
	if($('#admin-screen:hidden').length == 0)
	{
		$('#admin-screen').fadeTo(100, 0);
	}
	setTimeout(function() { setStateFinal(state) }, 100);
}
function setStateFinal(state) {
	switch (state) {
		case States.SLIDERS:
			$('#sliders-screen').fadeTo(300, 1);
			$('#seeing-proposals-screen').hide();
			$('#login-screen').hide();
			$('#voting-proposals-screen').hide();
			$('#admin-screen').hide();
			break;
		case States.LOGGING_IN:
			$('#login-screen').fadeTo(300, 1);
			$('#sliders-screen').hide();
			$('#seeing-proposals-screen').hide();
			$('#voting-proposals-screen').hide();
			$('#admin-screen').hide();
			break;
		case States.SEEING_PROPOSALS:
			$('#seeing-proposals-screen').fadeTo(300, 1);
			$('#sliders-screen').hide();
			$('#login-screen').hide();
			$('#voting-proposals-screen').hide();
			$('#admin-screen').hide();
			break;
		case States.VOTING_PROPOSALS:
			$('#voting-proposals-screen').fadeTo(300, 1);
			$('#sliders-screen').hide();
			$('#seeing-proposals-screen').hide();
			$('#login-screen').hide();
			$('#admin-screen').hide();
			break;
		case States.ADMIN:
			$('#admin-screen').fadeTo(300, 1);
			$('#sliders-screen').hide();
			$('#seeing-proposals-screen').hide();
			$('#login-screen').hide();
			$('#voting-proposals-screen').hide();
			break;
	}
}

function setSliderValues(values) {
	for (const [slider, value] of Object.entries(values)) {
		$("#"+slider.toLowerCase()+"-slider").val(value);
	}
}

function sendSignIn() {
	connection.sendSessionId($("#username-signin").val()+"|"+$("#password-signin").val());
	console.log("sent a thing")
}
function acceptSignIn(sessionId) {
	var username = sessionId.split("|")[0];
	var password = sessionId.split("|")[1];
	cookies.setUsername(username);
	cookies.setPassword(password);
	signedIn = true;
}
function denySignIn() { // TODO
	alert("Your username is incorrect for that password");
}

function sendSignUp() {
	connection.sendSignUp($("#username-signup").val()+"|"+$("#password-signup").val());
}

function acceptSignUp() { // When this is called, backend will immediately after call acceptSignIn
	// TODO send back to page
}

function denySignUp() {
	// TODO message
}

$(document).ready(function(){
	setTimeout(function(){
		if(!connection.connectionError)
		{
			$("#connecting-screen").addClass('connecting');
			$("#connecting-screen").removeClass('screen');
		}
	}, 1000);
});