var regexValidators = {
	lower:/[a-z]+/,
	upper:/[A-Z]+/,
	number:/[0-9]+/,
	spetial:/[*.!@$%^&(){}\[\]:;<>,.\?\/\~_\+\-=\|]+/,
	mail:/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
	forbidden:/^([^<>"_'=;\(\)\/\\])+$/
}

const maxUpdateLevel = 5

const signUpForm = document.getElementById("signUpForm")

encode = data =>{
	var encoded = ""
	for (var [key, value] of data.entries()) { 
	  encoded += encodeURIComponent(key)+"="+encodeURIComponent(value)+"&"
	}
	return encoded
}

var errorSignUpDisplay = signUpForm.getElementsByClassName("error")[0]

signInError = err => {
	console.log("XMLhttp error:",err)
	errorSignUpDisplay.innerText = err
}

//xmlhttp requests
var requests = {}

//get all inputs
const formInputs = signUpForm.querySelectorAll("input")

var validators = {}
formInputs.forEach((input)=>{
	if (input.type != "submit")
	{
		validators[input.name] = []
	}
})

//validator
const formValidators = document.querySelectorAll(".validator")
formValidators.forEach((element)=>{
	Array.from(element.children).forEach((child)=>{
		validators[element.getAttribute("for")].push({
			type:child.getAttribute("type"),
			validator:child
		})
		if (child.getAttribute("type") == "request"){
			requests[element.getAttribute("for")] = new XMLHttpRequest()
			requests[element.getAttribute("for")].addEventListener("load",(event)=>{
				if (requests[element.getAttribute("for")].status == 200){
					console.log(requests[element.getAttribute("for")].responseText)
					var data = JSON.parse(requests[element.getAttribute("for")].responseText)
					if (data.error)
						switch (data[child.getAttribute("error")]) {
							case "null field":
								signInError("Veuillez remplir tous les champs")
								break
							case "token":
								window.location.reload()
								break
							default:
								signInError("Une erreur interne est survenue veuillez recommencer plus tard")
								break
						}
					else {
						child.classList.remove("wait")
						//console.log(child.getAttribute("inverted"))
						if (child.getAttribute("inverted") == ""){
							if (data[child.getAttribute("valide")]){
								child.classList.add("error")
								child.classList.remove("valide")
							} else {
								child.classList.remove("error")
								child.classList.add("valide")
							}
						} else {
							if (data[child.getAttribute("valide")]){
								child.classList.remove("error")
								child.classList.add("valide")
							} else {
								child.classList.add("error")
								child.classList.remove("valide")
							}
						}
						
					}
				} else {
					signInError("Une erreur est survenue l'ors de la vérification d'un de champs veuillez recommencer plus tard.")
				}
			})
		}
	})
})

updateValidators = (value,name,updateLevel=0,submit=false) => {
	console.log(value)
	if (name != "submit")
	validators[name].forEach((validator)=>{
		switch (validator.type){
			case "size":
				if (value.length > Number(validator.validator.getAttribute("min")) && 
					value.length < Number(validator.validator.getAttribute("max")))
					validator.validator.classList.remove("error")
				else
					validator.validator.classList.add("error")
			break
			case "sizemi":
				if (value.length > Number(validator.validator.getAttribute("min")))
					validator.validator.classList.remove("error")
				else
					validator.validator.classList.add("error")
			break
			case "sizema":
				if (value.length < Number(validator.validator.getAttribute("max")))
					validator.validator.classList.remove("error")
				else
					validator.validator.classList.add("error")
			break
			case "match":
				if (value == signUpForm[validator.validator.getAttribute("with")].value)
					validator.validator.classList.remove("error")
				else
					validator.validator.classList.add("error")
				break
			case "validator":
				if (value.match(regexValidators[validator.validator.getAttribute("validator")]))
					validator.validator.classList.remove("error")
				else
					validator.validator.classList.add("error")
				break
			case "update":
				if (updateLevel < maxUpdateLevel){
					var updateName = validator.validator.getAttribute("update")
					updateValidators(signUpForm[updateName].value,signUpForm[updateName].name,updateLevel+1)
				}
				break
			case "request":
				if (value.length > 0 && !submit)
				{
					const url = validator.validator.getAttribute("url")
					var data = new FormData()
					data.append(name,value)
					requests[name].open("POST",url)
					requests[name].setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
					requests[name].send(encode(data))

					validator.validator.classList.add("wait")
					validator.validator.classList.remove("valide")
					validator.validator.classList.remove("error")
				}
				break
		}
	})
}

checkAll = (submit=false) => {
	formInputs.forEach((element)=>{
		updateValidators(element.value,element.name,0,submit)
	})
}

//event listener
formInputs.forEach((element)=>{
	element.addEventListener("input",(event)=>{
		var value = event.target.value
		var name = event.target.name
		
		updateValidators(value,name)
	})
})

signUpForm.addEventListener("submit",(event)=>{
	checkAll(true)
	var invalid = document.querySelectorAll(".validator .error")
	if (invalid.length != 0){
		event.preventDefault()
		signUpForm[invalid[0].parentNode.getAttribute("for")].focus()
	}
})

const urlParams = new URLSearchParams(window.location.search)

for(const param of urlParams.entries()) {
	try {
		signUpForm[param[0]].value = param[1]
	} catch(e) {

	}
}

const error = urlParams.get("error")
if (error){
	switch (error){
		case "csrfToken":
			signInError("Votre token a expiré veuillez recomencer.")
			break
		case "pseudo":
			signInError("Le pseudo est invalide")
			break
		case "mail":
			signInError("Le mail est invalide")
			break
		case "password":
			signInError("Le mot de passe est invalide")
			break
		case "passwordMatch":
			signInError("Les mots de passes ne correspondent pas")
			break
		case "exist":
			signInError("Le pseudo ou le mail ne sont pas disponibles")
			break
		default:
			signInError("Une erreur interne est survenue veuillez recommencer plus tard")
			break
	}
}
checkAll()