var body = document.body
var signin = document.getElementById("signIn")

bodyOverflow = hash => { //verify if hash is present and disable scroll bar
	if (hash == "#signIn"){
		body.style.overflow = "hidden"
	} else {
		body.style.overflow = "auto"
	}
}

encode = data =>{ //encode form data to XMLHttpRequest header
	var encoded = ""
	for (var [key, value] of data.entries()) { 
	  encoded += encodeURIComponent(key)+"="+encodeURIComponent(value)+"&"
	}
	return encoded
}

if (signin){ //if element exist

	//get necesary childs
	var signinForm = signin.children[0]
	var signInErrorDisplay = signinForm.querySelectorAll(".signinContener .form__error")[0]

	//display error on the page
	setSignInError = (errorText="") =>{
		signInErrorDisplay.innerText = errorText
		if (errorText)
			console.error(errorText)
	}

	//display things

	signin.addEventListener("click", (event)=>{ //on click on other place thant dialog
		if(event.target == signin){
			window.location.hash = ""
		}
	})

	body.addEventListener("keydown", (event)=>{
		if(event.keyCode == 27 && window.location.hash == "#signIn"){ //on escape pressed
			window.location.hash = ""
		}
	})



	if ("onhashchange" in window) { // event supported?
		window.onhashchange = function () {
			bodyOverflow(window.location.hash)
		}
	}
	else { // event not supported:
		var storedHash = window.location.hash
		window.setInterval(function () {
			if (window.location.hash != storedHash) {
				storedHash = window.location.hash
				bodyOverflow(hash)
			}
		}, 100)
	}

	bodyOverflow(window.location.hash)

	//signin things
	var signinRequest = new XMLHttpRequest()

	signinRequest.addEventListener("load",(event)=>{
		if (signinRequest.status == 200){
			var data = JSON.parse(signinRequest.responseText)
			if (data.result){
				document.location = "#"
				window.location.reload()
			} else {
				//console.log('Error:',data.error)
				switch (data.err) {
					case "pseudo":
						setSignInError("Le pseudo est invalide")
						break
					case "password":
						setSignInError("Le mot de passe est invalide")
						break
					case "input":
						setSignInError("Veuillez remplir tous les champs")
						break
					case "token":
						console.log('invalid token')
						window.location.reload()
					break
					default:
						setSignInError("Une erreur interne est survenue veuillez recommencer plus tard")
					break
				}
			}
		} else {
			logInError("Une erreur est survenue veuillez recommencer plus tard.")
		}
		signinForm.classList.remove("wait")

	})

	//on submit, disable send and create a request
	signinForm.addEventListener("submit",(event)=>{
		event.preventDefault()

		var formData = new FormData(event.target)

		signinForm.classList.add("wait")
		signinRequest.open("POST","/user/signin")
		signinRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		signinRequest.send(encode(formData))
	})
}