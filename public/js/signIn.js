var pseudoTooltip = document.getElementById("pseudoTooltip")
var pseudoInput = document.getElementById("pseudo")
var emailTooltip = document.getElementById("emailTooltip")
var emailInput = document.getElementById("email")
var passwordTooltip = document.getElementById("passwordTooltip")
var passwordConfTolltip = document.getElementById("passwordConfTolltip")

var js = document.getElementById("javascript") //display if the client disable javascript
js.style.display = 'none'

pseudoChange = () =>{
	var pseudo = pseudoInput.value.length
	if (pseudo<=2 || pseudo > 15)
		pseudoTooltip.style.display = "block"
	else
		pseudoTooltip.style.display = "none"
}
pseudoInput.addEventListener("keyup", pseudoChange)
pseudoInput.addEventListener("change", pseudoChange)

var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

emailChange = () =>{
	var email = emailInput.value
	if (emailRegex.test(email))
		emailTooltip.style.display = "none"
	else
		emailTooltip.style.display = "block"
}
emailInput.addEventListener("keyup", emailChange)
emailInput.addEventListener("change", emailChange)