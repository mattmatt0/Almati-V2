var pseudoInput         = document.getElementById("pseudo")
var emailTooltip        = document.getElementById("emailTooltip")
var emailInput          = document.getElementById("email")
var passwordTooltip     = document.getElementById("passwordTooltip")
var passwordTooltipP    = document.querySelector("#passwordTooltip>p")
var passwordInput       = document.getElementById("passwordLog")
var passwordConfTooltip = document.getElementById("passwordConfTolltip")
var passwordConf        = document.getElementById("passwordConf")


//verify the pseudo's length because it must do more than 2 carater and less than 15 caracter
pseudoChange = () =>{
	var pseudo = pseudoInput.value.length
	if (pseudo != 0)
		if (pseudo<=2 || pseudo > 15)
			pseudoInput.className = "invalid"
		else
			pseudoInput.className = ""
	else
		pseudoInput.className = ""
}
pseudoInput.addEventListener("keyup", pseudoChange)
pseudoInput.addEventListener("change", pseudoChange)

//verify if the email is valid
var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

emailChange = () =>{
	var email = emailInput.value
	if (email != 0)
		if (emailRegex.test(email))
			emailInput.className = ""
		else
			emailInput.className = "invalid"
	else
		emailInput.className = ""
}
emailInput.addEventListener("keyup", emailChange)
emailInput.addEventListener("change", emailChange)

//verify the password for make it strong
var regexPassword = [/[a-z]/,/[A-Z]/,/[0-9]/,/[!@#$%^&*_-]/]
passwordChange = () =>{
	var password = passwordInput.value
	if (password.length != 0)
		if(!regexPassword[0].test(password))
		{
			passwordTooltipP.innerText = "Le mot de passe doit contenir au mois un caratère minuscule"
			passwordInput.className = "invalid"
		}
		else if(!regexPassword[1].test(password))
		{
			passwordTooltipP.innerText = "Le mot de passe doit contenir au mois un nombre"
			passwordInput.className = "invalid"
		}
		else if(!regexPassword[2].test(password))
		{
			passwordTooltipP.innerText = "Le mot de passe doit contenir au mois un caratère majuscule"
			passwordInput.className = "invalid"
		}
		else if (!regexPassword[3].test(password))
		{
			passwordTooltipP.innerText = "Le mot de passe doit contenir au mois un caratère spécial (!@#$%^&*_-)"
			passwordInput.className = "invalid"
		}
		else if (password.length < 8)
		{
			passwordTooltipP.innerText = "Le mot de passe doit faire plus de 8 caratères"
			passwordInput.className = "invalid"
		}
		else
		{
			passwordInput.className = ""
		}
	else
		passwordInput.className = ""
}
passwordInput.addEventListener("keyup", passwordChange)
passwordInput.addEventListener("change", passwordChange)

//verify the
passwordVerifChange = () =>{
	var passwordConfirm = passwordConf.value
	var password = passwordInput.value
	if (passwordConf.length != 0)
		if (passwordConfirm == password)
			passwordConf.className = ""
		else
			passwordConf.className = "invalid"
	else
		passwordConf.className = ""
}
passwordConf.addEventListener("keyup", passwordVerifChange)
passwordConf.addEventListener("change", passwordVerifChange)
