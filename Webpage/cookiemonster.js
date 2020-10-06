
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

	setUsername(username) {
		localStorage.username = name;
		this.username = name;
	}
	getUserame() {
		return this.username; 
	}

	setPassword(password) {
		localStorage.password = password;
		this.password = password;
	}
	getPassword() {
		return this.password; 
	}

}
