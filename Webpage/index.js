var cookies = new CookieMonster()
var connection = new BackendConnection()

var signedIn = false;
var admin = false;
var isProblemPhase = false;

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
function acceptSignIn(username, password, isAdmin, isInProblemPhase) {
	admin = isAdmin === "true"
	cookies.setUsername(username);
	cookies.setPassword(password);
	signedIn = true;
	$('#header-signin').hide();
	$('#header-signed-in').show();
	$('#signed-in-as').text(username)
	isProblemPhase = isInProblemPhase
	if (admin) {
		$('#admin-screen').show();
	}
	if (isProblemPhase) {
		$('#voting-phase').show();
		$('#problems-phase').hide();
	}
	else {
		$('#voting-phase').hide();
		$('#problems-phase').show();
	}
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

function adminAddProblem() {
	var problem = $('#template-admin-problem').html()
	$('#admin-problems').append(problem)
}
function adminRemoveProblem() {
	$('#admin-screen').find(".admin-problem").last().remove();
}
function changeToProblemPhase() {
	var problems = []
	$('#admin-screen').find(".admin-problem").each( function(index, element) {
		optionsText = [element.children[6].value, element.children[10].value]
		if (element.children[14].value.trim().length > 1) {
			optionsText.push(element.children[14].value)
		}
		problems.push({
			"problemText": element.children[2].value,
			"optionsText": optionsText,
		})
	});
	connection.changeToProblemPhase(JSON.stringify(problems))
	$('#voting-phase').hide();
	$('#problems-phase').show();
}
function somethingWentWrong(message) {
	alert("Something went wrong. The action may not have completed correctly.\nServer returned: "+message)
}

function adminSetWealth() { connection.sendSetSlider("Wealth", $('#admin-wealth-input').val() )}
function adminSetMilitary() { connection.sendSetSlider("Military", $('#admin-military-input').val() )}
function adminSetConsciousness() { connection.sendSetSlider("Consciousness", $('#admin-consciousness-input').val() )}
function adminSetCulture() { connection.sendSetSlider("Culture", $('#admin-culture-input').val() )}
function adminSetPiety() { connection.sendSetSlider("Piety", $('#admin-piety-input').val() )}

function changeToVotingPhase() {
	connection.changeToVotingPhase();
	$('#voting-phase').show();
	$('#problems-phase').hide();
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