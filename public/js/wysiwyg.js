//save the parent into this before click on button
var parentBuff = 0

//save the selected text into this before click on button
var textBuff = ""
var parentBuff = ""
var formatBuff = ""

var languageSelector = document.getElementById("languageChoice")
var languageProposition = document.getElementById("languageProposition")
var divSelectLanguage = document.querySelectorAll("div[id^=language-item-]")

var prismToAce = new Map()
prismToAce.set("markup","xml")//convert prism's language names to ace's language name
prismToAce.set("css","css")
prismToAce.set("javascript","javascript")
prismToAce.set("c","c_cpp")
prismToAce.set("csharp","csharp")
prismToAce.set("bash","sh")
prismToAce.set("basic","plain_text")
prismToAce.set("batch","batchfile")
prismToAce.set("cpp","c_cpp")
prismToAce.set("arduino","c_cpp")
prismToAce.set("coffeescript","cofee")
prismToAce.set("ruby","ruby")
prismToAce.set("d","c_cpp")
prismToAce.set("markup-templating","")
prismToAce.set("ejs","ejs")
prismToAce.set("git","plain_text")
prismToAce.set("java","java")
prismToAce.set("php","php")
prismToAce.set("json","json")
prismToAce.set("jsonp","jsp")
prismToAce.set("json5","json")
prismToAce.set("kotlin","kotlin")
prismToAce.set("markdown","markdown")
prismToAce.set("lisp","lisp")
prismToAce.set("lua","lua")
prismToAce.set("monkey","plain_text")
prismToAce.set("objectivec","objectivec")
prismToAce.set("perl","perl")
prismToAce.set("sql","sql")
prismToAce.set("powershell","powershell")
prismToAce.set("processing","java")
prismToAce.set("scss","scss")
prismToAce.set("python","python")
prismToAce.set("sass","sass")
prismToAce.set("shell-session","sh")
prismToAce.set("plsql","sql")
prismToAce.set("yaml","yaml")
prismToAce.set("haml","haml")
prismToAce.set("html","html")
prismToAce.set("regex","plain_text")

//list of format's balise
var listBalise = ["I","U","B","SPAN"]

getParent = () =>{//get the parent of the cursor
	var parent, selection
	if (window.getSelection)
	{
		selection = window.getSelection()
		if (selection.rangeCount)
		{
			parent = selection.getRangeAt(0).commonAncestorContainer
			if (!~listBalise.indexOf(parent.nodeName.toLocaleUpperCase()))
				parent = parent.parentNode
			return parent
		}
	}
}

getTextSelection = () =>{//get the user's text selection
	textSelection = window.getSelection()
	text = textSelection.getRangeAt(0).toString()
	return text
}

updateBuff = ()=>{
	textBuff = getSelection()
	parentBuff = getParent()
	formatBuff = document.queryCommandValue("formatBlock")
}

function escapeHTML(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
 }


//dialog box
//toogleSmiley()
function insertSmiley(button)
{
	//function to insert smiley
	document.execCommand("insertHTML",false,button.innerHTML)
 
	//set focus on editor
	content.focus()

}
function toogleSmiley(hide=false)
{
	var smileyBoard = document.getElementById("smileyBoard");
	var smileyButton = document.getElementById("smiley");
	if(smileyButton.className === "default" && hide==false)
	{
		smileyBoard.className = "show"
		smileyButton.className = "active"
	}
	else
	{
		smileyBoard.className = "hide"
		smileyButton.className = "default"
	}

}

function note()
{
	toogleSmiley(true)
	updateBuff()
	var noteDialog = document.getElementById("noteDialog");
	var noteButton = document.getElementById("note");
	if(noteButton.className == "default")
	{
		noteButton.className = "active"
		noteDialog.style.transform = "translateY(-50%) translateX(-50%)";
		disableEverything();
		noteButton.disabled = false;
	}
	else
	{
		noteButton.className = "default"
		noteDialog.style.transform = "translateY(100vh) translateX(-50%)";
		enableEverything();
	}

}

function code(element)
{
	console.log(element)
	if (element)//if we give a html node
	{
		editor.setValue(element.innerText)//get the text of the node
		language = element.className.split("-")[1]
		editor.session.setMode("ace/mode/"+prismToAce.get(language))//change the language
		languageSelector.value = language
	}
	else
	{
		editor.setValue("")
		editor.session.setMode("ace/mode/plain_text")
		languageSelector.value = ""
	}
	toogleSmiley(true)
	var codeDialog = document.getElementById("codeDialog");
	var codeButton = document.getElementById("code");
	if(codeButton.className === "default")
	{
		codeButton.className = "active"
		codeDialog.style.transform = "translateY(-50%) translateX(-50%)";
		disableEverything();
		codeButton.disabled = false;
	}
	else
	{
		codeButton.className = "default"
		codeDialog.style.transform = "translateY(100vh) translateX(-50%)";
		enableEverything();
	}

}
function disableEverything()
{
	document.getElementById("content").contentEditable = false;
	buttons = document.getElementsByTagName("button");
	for(i = 0; i<buttons.length; ++i)
	{
		buttons[i].disabled = true;
	}
	options = document.getElementsByClassName("windowsOptions")

	for (var i = 0; i < options.length; i++) {
		options[i].disabled = false;
	}
	document.getElementsByTagName("select")[0].disabled = true;
	document.getElementById("smileyBoard").style.filter = "blur(10px)";
}

function enableEverything()
{
	document.getElementById("content").contentEditable = true;
	buttons = document.getElementsByTagName("button");
	for(i = 0; i<buttons.length; ++i)
	{
		buttons[i].disabled = false;
	}
	document.getElementsByTagName("select")[0].disabled = false;
	document.getElementById("smileyBoard").style.filter = "";
}

function hide(element)
{
	if (typeof(element) != "string"){
		element = element.parentElement.parentElement.parentElement
	}

	if(element.id === "codeDialog" || element === "codeDialog")
	{
		document.getElementById("code").style.backgroundColor = "black"
		document.getElementById("code").className = "default"
		codeDialog.style.transform = "translateY(100vh) translateX(-50%)"
		enableEverything();
	}
	if(element.id === "noteDialog" || element === "noteDialog")
	{
		document.getElementById("note").style.backgroundColor = "black"
		document.getElementById("note").className = "default"
		noteDialog.style.transform = "translateY(100vh) translateX(-50%)"
		enableEverything();
	}
	//set focus on editor
	content.focus()
}

//editor functions

var content = document.getElementById("content")
var textType = document.getElementById("textType")
/*list of format commands if you want to add command you may add a new button and add command in this list
of course you must modify css*/
var listCommand = ["bold","italic","underline"]

//execute command
textFormat = (format) =>{//format the text (underline, strong...)
	updateBuff()
	if (format != undefined && format != "" && format != null)
	{
		if (formatBuff != "h3" && formatBuff !="h5")
		{
			if (~ listCommand.indexOf(format))
			{
				//execute the button's command
				document.execCommand(format,false,"")
				//set focus on editor
				content.focus()
			}
			else
			{
				console.error("commande "+format+" inconue")
			}
		}//display errors
		else
			console.warn("titres non modifiables !")
	}
	else
	{
		console.warn("aucune commande")
	}
	buttonUpdate()
}

//update the button
buttonUpdate = () =>{
	//console.log("update")

	//update the format button's background
	for (var i = 0; i < listCommand.length; i++) {
		var buff = listCommand[i]
		if (document.queryCommandState(buff))
			document.getElementById(buff).className = "active"
		else
			document.getElementById(buff).className = "default"
	}
	//update the select
	parent = document.queryCommandValue("formatBlock")

	//get the parent's type ignoring the balises in listBalise
	while (~ listBalise.indexOf(parent))
		parent = parent.parentNode
	//console.log(parent)
	//console.log(parent.nodeName)
	
	if (parent == "p")
		textType.value = "tips"
	else if (parent == "")
		textType.value = "div"
	else
		textType.value = parent
}

//add event listener to update the toolbar
content.onclick = buttonUpdate
content.onkeyup = buttonUpdate

textType.onchange = () =>{
	//get the command
	var buf = textType.selectedOptions[0].value
	updateBuff()
	var parent = parentBuff.nodeName

	if (buf == "tips")
		note()//display tips windows.
	else
	{
		console.log(parentBuff)
		if (formatBuff == "p")//if we are in tips
		{
			console.log("parent is tips")
			parentBuff.className = ""//reset classname
		}
		document.execCommand("formatBlock",false,buf)//execute the command
	}
	//set focus on editor
	content.focus()
}


//list of forbiden parent
var forbiden = ["ARTICLE","H3","H5","BUTTON","NAV","SELECT","BODY","OPTION"]

var tipsType = ["warning tips","error tips","good tips","info tips","reset tips"]
validateNote = (obj) =>{
	var name = obj.className//get the class name
	console.log(name)
	hide("noteDialog")

	if (!~tipsType.indexOf(name))//verify the tips type
	{
		console.log("entrée invalide !!")
	}
	else if (name == "reset tips")
	{
		console.log("reset")
		formatBuff.className = ""
		document.execCommand("formatBlock",false,"<div>")
	}
	else
	{
		if (parentBuff.nodeName != "ARTICLE" && parentBuff.nodeName != "BODY")
			parentBuff.remove()
			if (textBuff == "")
				textBuff = parentBuff.innerText
		document.execCommand("insertHTML",false,"<p class=\""+name+"\">"+textBuff+"</p>")
	}
	buttonUpdate()
	content.focus()
}

validateCode = (element) =>{
	hide("codeDialog")
	if (element == undefined)
		document.execCommand("insertHTML",false,"<pre contentEditable='false'><code class=\"language-"+languageSelector.value+"\">"+escapeHTML(editor.getValue())+"</code></pre>")
	else
	{
		element.children[0].innerText = editor.getValue()
		element.className = "language-"+languageSelector.value
	}

	document.querySelectorAll("article pre[contentEditable='false']").forEach((element)=>{
		element.onclick = (evt)=>{
			//console.log(evt.target)
			code(evt.target)
		}
	})
}

//add event for code
hideProposition = () =>{
	languageProposition.style.display = "none"
	divSelectLanguage.forEach((element)=>{
		element.style.display = "none"
	})
}

languageChoiceEvent =  (evt) =>{

	//display the languages wich can correspond to the text wich already tiped by the user
	let text = languageSelector.value
	console.log(text)
	if (text.length>0)//if lenght < 0 the user has never tip anithing
	{
		languageProposition.style.display = "block"
		var result = Array.from(document.querySelectorAll("div[id^=language-item-"+text+"]"))

		divSelectLanguage.forEach((element)=>{
			if (result.indexOf(element) == -1)
			{
				element.style.display = "none"
			}
			else
			{
				element.style.display = "block"
			}
		})
	}
	else
	{//hide the propositions
		hideProposition()
	}
}

divSelectLanguage.forEach((element)=>{//set the text for input that select the language
	element.onclick = (evt) =>{
		languageSelector.value = evt.target.innerText
		editor.session.setMode("ace/mode/"+prismToAce.get(languageSelector.value))
		hideProposition()
	}
})


//languageSelector.onkeydown = inputEvent
languageSelector.addEventListener("keyup",languageChoiceEvent)
languageSelector.addEventListener("keydown",languageChoiceEvent)
