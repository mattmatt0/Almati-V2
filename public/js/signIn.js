var pseudoTooltip = document.getElementById("pseudoTooltip")
var pseudoInput = document.getElementById("pseudo")
var emailTooltip = document.getElementById("emailTooltip")
var passwordTooltip = document.getElementById("passwordTooltip")
var passwordConfTolltip = document.getElementById("passwordConfTolltip")

pseudoChange = () =>{
	pseudo = pseudoInput.value
	console.log(pseudo)
}
pseudoInput.addEventListener("keypress", alert("e"))