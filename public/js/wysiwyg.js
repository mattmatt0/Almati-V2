//save the parent into this before click on button
var parentBuff = 0

//save the selected text into this before click on button
var textBuff = ""
var parentBuff = ""
var formatBuff = ""

getParent = () =>{//get the parent of the cursor
	var parent, selection
	if (window.getSelection)
	{
		selection = window.getSelection()
		if (selection.rangeCount)
		{
			parent = selection.getRangeAt(0).commonAncestorContainer
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

function code()
{
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

//list of balises
var listBalise = ["I","U","B","SPAN"]

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
	console.log(parent)
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
validate = (obj) =>{
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
		parentBuff.className = ""
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
