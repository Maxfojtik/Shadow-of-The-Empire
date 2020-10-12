var cookies = new CookieMonster()
var connection = new BackendConnection()

const States = {
	SLIDERS: "InSliders",
	SIGNING_UP: "SigningUp",
	SEEING_PROPOSALS: "SeeingProposals",
	VOTING_PROPOSALS: "VotingProposals",
	ADMIN: "Admin"
};

var signedIn = false;
var admin = false;

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
function hideStatesExcept(state) {
	states = [
		'#sliders-screen',
		'#seeing-proposals-screen',
		'#voting-proposals-screen',
		'#admin-screen',
	]
	states.forEach(function(screen) { 
		if (screen !== state) {
			$(screen).hide();
		}
	});
}
function setStateFinal(state) {
	switch (state) {
		case States.SLIDERS:
			$('#sliders-screen').fadeTo(300, 1);
			hideStatesExcept('#sliders-screen');
			break;
		case States.SIGNING_UP:
			$('#signup-screen').fadeTo(300, 1);
			hideStatesExcept('#signup-screen');
			break;
		case States.SEEING_PROPOSALS:
			$('#seeing-proposals-screen').fadeTo(300, 1);
			hideStatesExcept('#seeing-proposals-screen');
			break;
		case States.VOTING_PROPOSALS:
			$('#voting-proposals-screen').fadeTo(300, 1);
			hideStatesExcept('#voting-proposals-screen');
			break;
		case States.ADMIN:
			$('#admin-screen').fadeTo(300, 1);
			hideStatesExcept('#admin-screen');
			break;
	}
}

function requestSliderValues() { // TODO
	connection.sendSliders();
}
function setSliderValues(values) {
	for (const [slider, value] of Object.entries(values)) {
		$("#"+slider.toLowerCase()+"-slider").val(value);
	}
}

// Called by frontend
function sendSignIn() {
	connection.sendSessionId($("#username-input").val()+"|"+$("#password-input").val());
}
// Called by backend
function acceptSignIn(username, password, isAdmin) {
	admin = isAdmin === "true"
	console.log("Username: "+username)
	console.log("Password: "+password)
	cookies.setUsername(username);
	cookies.setPassword(password);
	signedIn = true;
	$('#header-signin').hide();
	$('#header-signed-in').show();
	$('#signed-in-as').text(username)
}
// Called by backend
function denySignIn() { // TODO
	alert("Your username is incorrect for that password.");
}

// Called by frontend
function sendSignUp() {
	var username = $("#username-input").val()
	var password = $("#password-input").val()

	if (password.length == 4 && username.length >= 4 && (username+""+password).indexOf("|") === -1) {
		var accountCode = prompt("Confirm sign up.\nUsername: "+username+"\nPassword: "+password+".\nBe aware this site is not secure, do not reuse passwords.\n\nEnter your account code:")
		accountCode = accountCode.toUpperCase()
		connection.sendSignUp(username+"|"+password+"|"+accountCode);
	}
	else {
		if ((username+""+password).indexOf("|") === -1) {
			alert("Username must be 4 digits or longer.\nPassword must be exactly 4 digits.\nDo not reuse passwords for this site, it is not secure.")
		}
		else {
			alert("Username must be 4 digits or longer.\nPassword must be exactly 4 digits.\nUsername and password may not contain the '|' character.\nDo not reuse passwords for this site, it is not secure.")
		}
	}
}
// Called by backend
function acceptSignUp() { // When this is called, backend will immediately after call acceptSignIn
	// TODO send back to page
}
// Called by backend
function denySignUp(reason) {
	alert("Unable to sign up:\n"+reason)
}

function signOut() {
	cookies.removeCookies()
	location.reload();
}

$(document).ready(function(){
	setInterval(requestSliderValues, 10000)
	setTimeout(function(){
		if(!connection.connectionError)
		{
			$("#connecting-screen").addClass('connecting');
			$("#connecting-screen").removeClass('screen');
		}
	}, 1000);
});