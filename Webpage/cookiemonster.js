
// Default username = "n"
// Default password = "l"

class CookieMonster {

	constructor() {
		
		if (localStorage.username && localStorage.username != "n") {
			this.username = localStorage.username;
		}
		else {
			this.username = "n";
		}

		if (localStorage.password && localStorage.password != "l") {
			this.password = localStorage.password;
		}
		else {
			this.password = "l";
		}
	}

	setUsername(name) {
		localStorage.username = name;
		this.username = name;
	}
	getUsername() {
		return this.username; 
	}

	setPassword(password) {
		localStorage.password = password;
		this.password = password;
	}
	getPassword() {
		return this.password; 
	}

	getSessionId() {
		return this.getUsername()+"|"+this.getPassword();
	}

	removeCookies() {
		this.setUsername("n")
		this.setPassword("l")
	}
	
	hasLoginCred() {
		console.log(this.username + " " +this.password)
		return this.username.length >= 4 && this.password.length === 4
	}

}
