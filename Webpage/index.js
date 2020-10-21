var cookies = new CookieMonster()
var connection = new BackendConnection()

var signedIn = false;
var admin = false;
var isProblemPhase = false;

console.log("Hmmm." + 
    "\nMaybe you shouldn't be poking around here :/" +
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
        $('#problem-phase').show();
    }
    else {
        $('#voting-phase').show();
        $('#problem-phase').hide();
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

// USER PHASE

function populateUserProblemsPhase(dataString) {
    $('#voting-phase-user').hide()
    $('#problem-phase').show()
    // TODO show problems phase and hide voting phase, then clear problems phase
    dataJSON = JSON.parse(dataString)
    problems = dataJSON.problems
    hasTakenAction = dataJSON.hasTakenAction // Has submitted solution or signed
    console.log("hasTakenAction: "+hasTakenAction)
    problems.forEach( function( problem, index ) {
        index++
        // Button for tab
        var problemTab = $('#template-zone').find('#template-tablinks').clone().removeClass("#template-tablinks")
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
                addProposedSolution(index-1, solution["title"], solution["text"], solution["signatures"], solution.who)
            })
        }
        else {
            problemContent.find(".proposed-solutions-container").hide()
        }
        // Hide your input or don't
        if (hasTakenAction) {
            $('.propose-self-solution-container').hide()
        }
        else {
            problemContent.find('.propose-self-solution-container').find("button").on("click", function() {
                if (confirm('Are you sure you would like to propose this solution?' +
                    '\nThis consumes your vote/propose action and cannot be undone')) {
                    // Send it
                    console.log("Proposing solution: "+$(this).parent().find('textarea:eq(0)').val()+" | "+$(this).parent().find('textarea:eq(1)').val())
                    connection.proposeSolution(index-1, $(this).parent().find('textarea:eq(0)').val(), $(this).parent().find('textarea:eq(1)').val())
                    // Remove the options
                    $('.propose-self-solution-container').hide();
                }
            })
        }
    })

    $('#tab-button-problem-1').click();
}

function addProposedSolution(problemNum, title, text, signatures, proposedBy) {
    let problemContainer = $('#problem-'+(problemNum+1))
    let userVotedFor = signatures.includes(cookies.getUsername())
    let userProposed = proposedBy === cookies.getUsername()

    let newSolutionDiv = $('<div/>', {
        class: "proposed-solution solution" + (userVotedFor || userProposed ? " voted-solution" : "")
    })

    solutionHeaderDiv = $('<div/>', {
        class: "proposed-solution-header-div"
    })

    solutionHeaderDiv.append($('<p/>',{style: "margin-left: 20px; text-align: left"}).text("Proposed by: "+proposedBy))
    solutionHeaderDiv.append($('<h2></h2>').text(title))

    newSolutionDiv.append(solutionHeaderDiv)
    newSolutionDiv.append($('<p></p>').text(text))

    if (signatures.length > 0) {
        newSolutionDiv.append($('<p/>', {
            class: "solution-signatures"
        }).text(getSignaturesText(signatures)))
    }

    newSolutionDiv.click( function() {
        if ($(this).find('.solution-signatures').text().includes(cookies.getUsername())) {
            connection.signntFor(problemNum, $(this).index())
            $(this).removeClass("voted-solution")
            $('.propose-self-solution-container').show();
        }
        else {
            connection.signFor(problemNum, $(this).index())
        }
    })

    problemContainer.find('.proposed-solutions').append(newSolutionDiv)
    problemContainer.find(".proposed-solutions-container").show() // In case it's currently hidden
}

function getSignaturesText(signatures) {
    return "Signatures: "+signatures.join(", ")
}

// Called by backend, updates when a signature is added/removed from a problem
function signedFor(problemNum, solutionNum, signatures) {
    signatures = JSON.parse(signatures)
    let problemContainer = $('#problem-'+(problemNum+1))
    let solutionContainer = problemContainer.find(".proposed-solutions").children().eq(solutionNum)
    
    // If the text currently doesn't exist
    if (solutionContainer.find('.solution-signatures').length === 0) {
        if (signatures.length >= 0) {
            solutionContainer.append($('<p/>', {
                class: "solution-signatures"
            }).text(getSignaturesText(signatures)))
        }
    }
    else {
        if (signatures.length >= 0) {
            solutionContainer.find('.solution-signatures').text(getSignaturesText(signatures))
        }
        else {
            solutionContainer.find('.solution-signatures').delete()
        }
    }

    if (signatures.includes(cookies.getUsername())) {
        solutionContainer.addClass("voted-solution")
        $('.propose-self-solution-container').hide();
    }
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
function getVotesText(votes) {
    return "Votes: "+votes.join(", ")
}
function populateUserVotingPhase(problemsString) {
    // TODO show voting phase and hide problems phase, then clear voting phase
    $('#voting-phase-user').empty()
    $('#voting-phase-user').show()
    $('#problem-phase').hide()
    problems = JSON.parse(problemsString)
    console.log(problems)

    problems.forEach( function(problem, index) {
        var problemContainer = $('<div/>', {
            id: "voting-problem-"+index
        })
        // Add problem text
        problemContainer.append($('<h2/>').text(problem["title"]))
        problemContainer.append($('<p/>').text(problem["text"]))

        problem["solutions"].forEach( function(solution, solutionIndex) {
            var solutionContainer = $('<div/>', {
                class: "solution",
                id: "voting-problem-"+index+"-solution-"+solutionIndex,
            })
            solutionContainer.append($('<h2/>').text(solution["title"]))
            solutionContainer.append($('<p/>').text(solution["text"]))
            solutionContainer.append($('<p/>', {
                class: "solution-votes"
            }).text(getVotesText(solution["votes"])))

            problemContainer.append(solutionsContainer)
        });

        problemContainer.on('click' function() {
            connection.toggleVote(index, solutionIndex)
        })

        $('#voting-phase-user').append(problemContainer)
    });
}

function votedFor(problemNum, solutionNum, votes) {
    signatures = JSON.parse(signatures)
    let problemContainer = $('#voting-problem-'+problemNum)
    let solutionContainer = problemContainer.find(".voting-problem-"+problemNum+"-solution-"+solutionNum)
    
    solutionContainer.find('.solution-votes').text(getVotesText(votes))

    if (votes.includes(cookies.getUsername())) {
        solutionContainer.addClass("voted-solution")
    }
    else {
        solutionContainer.removeClass("voted-solution")
    }
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

