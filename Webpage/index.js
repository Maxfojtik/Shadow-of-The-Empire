var cookies = new CookieMonster()
var connection = new BackendConnection()

var signedIn = false;
var admin = false;
var isProblemPhase = false;

console.log("Hmmm." + 
    "\nMaybe you shouldn't be poking around here :/." +
    "\nWe can't guarantee this won't break things." +
    "\nHopefully you're not trying to cheat in a game which is just for fun anyway."
    )

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
    isProblemPhase = isInProblemPhase === "true"
    cookies.setUsername(username);
    cookies.setPassword(password);
    signedIn = true;
    $('#header-signin').hide();
    $('#header-signed-in').show();
    $('#signed-in-as').text(username)
    if (admin) {
        $('#admin-screen').show();
    }
    else {
        $('#user-screen').show();
    }
    if (isProblemPhase) {
        $('#voting-phase').hide();
        $('#problems-phase').show();
    }
    else {
        $('#voting-phase').show();
        $('#problems-phase').hide();
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
        solutions = [
            {"title": element.children[8].value, "text": element.children[10].value}, 
            {"title": element.children[14].value, "text": element.children[16].value}
        ]
        if (element.children[20].value.trim().length > 1) {
            solutions.push({"title": element.children[20].value, "text": element.children[22].value})
        }
        problems.push({
            "problemTitle": element.children[2].value,
            "problemText": element.children[4].value,
            "solutions": solutions,
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

// User

function populateUserProblemsPhase(dataString) {
    dataJSON = JSON.parse(dataString)
    problems = dataJSON.problems
    hasSubmitted = dataJSON.hasSubmitted
    console.log("hasSubmitted: "+hasSubmitted)
    problems.forEach( function( problem, index ) {
        index++
        // Button for tab
        var problemTab = $('#template-tablinks').clone().removeClass("#template-tablinks")
        problemTab.attr('id', 'tab-button-problem-'+index)
        problemTab.click( function() { 
            $("#user-screen").find(".tab-content").hide()
            $("#user-screen").find(".tab-content").removeClass("active")
            $("#user-screen").find(".tablinks").removeClass("active")
            $("#user-screen").find("#problem-"+index).show()
            $(this).show()
            $(this).addClass("active") 
        })
        problemTab.html("Problem "+index)
        $('#tab-button-holder').append(problemTab)
        // Problem container
        var problemContent = $('#template-problem-container').clone().removeClass("#template-problem-container")
        $('#tabs-content-holder').append(problemContent)
        problemContent.attr('id', 'problem-'+index)
        // Add problem text
        problemContent.find(".problem-title").text(problem["problemTitle"])
        problemContent.find(".problem-text").text(problem["problemText"])
        // Add given solutions text
        problem["givenSolutions"].forEach( function(solution) {
            let tempSolutionDiv = $('<div/>', {
                class: "solution"
            })
            tempSolutionDiv.append($('<h2></h2>').text(solution["title"]))
            tempSolutionDiv.append($('<p></p>').text(solution["text"]))
            problemContent.find(".given-solutions").append(tempSolutionDiv);
        })
        // Add proposed solutions
        if (problem["proposedSolutions"].length > 0) {
            problem["proposedSolutions"].forEach( function(solution) {
                addProposedSolution(index-1, solution["title"], solution["text"], solution["votes"])
            })
        }
        else {
            problemContent.find(".proposed-solutions-container").hide()
        }
        // Hide your input or don't
        if (hasSubmitted) {
            $('.propose-self-solution-container').hide()
        }
        else {
            problemContent.find('.propose-self-solution-container').find("button").on("click", function() {
                if (confirm('Are you sure you would like to propose this solution?' +
                    '\nThis consumes your vote/propose action and cannot be undone')) {
                    // Send it
                    connection.proposeSolution(index-1, $(this).parent().find('textarea:eq(0)').val(), $(this).parent().find('textarea:eq(1)').val())
                    // Remove the options
                    $('.propose-self-solution-container').hide();
                }
            })
        }
    })

    $('#tab-button-problem-1').click();
}

function addProposedSolution(problemNum, title, text, votes) {
    let problemContainer = $('#problem-'+(problemNum+1))
    let userVotedFor = votes.includes(cookies.getUsername())

    let newSolutionDiv = $('<div/>', {
        class: "proposed-solution solution voted-solution"
    })

    solutionHeaderDiv = $('<div/>', {
        class: "proposed-solution-header-div"
    })

    solutionHeaderDiv.append($('<p/>').text("Proposed by: "+proposedBy))
    solutionHeaderDiv.append($('<h2></h2>').text(title))
    newSolutionDiv.append($('<p></p>').text(text))

    newSolutionDiv.append($('<p/>', {
        class: "solution-votes"
    }).text("Signatures: "+votes.join(", ")))

    problemContainer.find('.proposed-solutions').append(newSolutionDiv)
    problemContainer.find(".proposed-solutions-container").show() // In case it's currently hidden
}

/*
problems = [
    {
        title: "a",
        text: "b",
        solutions: [
            {
                title: "a",
                text: "b",
                voted: ["max", "matthew"]
            }
        ]
    }
]
*/
function populateUserVotingPhase(problemsString) {
    problems = JSON.parse(problemsString)

    problems.forEach( function(problem, index) {
        problems["text"]

        problem["solutions"].forEach( function(solution, index) {
            
        });
    });

}

function solutionClick() {
    $(this).addClass("voted-for")
    // Disable all solution buttons except the voted one
    $('.solution-vote').prop( "disabled", true );
    $(this).prop( "disabled", false );
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

