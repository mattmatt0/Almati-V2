const loginUrl = "/user/login"
const form = document.getElementById("loginForm")
var errorDisplay = form.getElementsByClassName("error")[0]

encode = data =>{
	var encoded = ""
	for (var [key, value] of data.entries()) { 
	  encoded += encodeURIComponent(key)+"="+encodeURIComponent(value)+"&"
	}
	return encoded
}

error = err => {
	console.log(err)
	errorDisplay.innerText = err
}

var postRequest = new XMLHttpRequest()

postRequest.addEventListener("load",(event)=>{
	if (postRequest.status == 200){
		var data = JSON.parse(postRequest.responseText)
		if (data.connected){
			window.reload()
		} else {
			//console.log('Error:',data.error)
			switch (data.error) {
				case "pseudo":
					error("Le pseudo est invalide")
					break;
				case "password":
					error("Le mot de passe est invalide")
					break;
				case "null field":
					error("Veuillez remplir tous les champs")
					break;
				default:
					error("Une erreur interne est survenue veuillez recommencer plus tard")
					break;
			}
		}
	} else {
		error("Une erreur est survenue veuillez recommencer plus tard.")
	}
	form.classList.remove("wait")

})

form.addEventListener("submit",(event)=>{
	// console.log(event)
	event.preventDefault() //block event
	var formData = new FormData(event.target)

	form.classList.add("wait")
	postRequest.open("POST",loginUrl)
	postRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	postRequest.send(encode(formData))
})