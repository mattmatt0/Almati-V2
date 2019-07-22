//save the parent into this before click on button
var parentBuff = 0

//save the selected text into this before click on button
var textBuff = ""
//dialog box
toogleSmiley()
function insertSmiley(button)
{
    document.getElementById("content").innerHTML += button.innerHTML;
}
function toogleSmiley()
{
    var smileyBoard = document.getElementById("smileyBoard");
    var smileyButton = document.getElementById("smiley");
    if(smileyButton.style.backgroundColor === "black")
    {
        smileyBoard.style.transform = "translateY(-100%)";
        smileyButton.style.backgroundColor = "#0AF";
    }
    else
    {
        smileyBoard.style.transform = "translateY(0%)";
        smileyButton.style.backgroundColor = "black";
    }

}

function note()
{
    parentBuff = getParent()
    textBuff = getTextSelection()
    var noteDialog = document.getElementById("noteDialog");
    var noteButton = document.getElementById("note");
    if(noteButton.style.backgroundColor === "black")
    {
        noteButton.style.backgroundColor = "#0AF";
        noteDialog.style.transform = "translateY(-50%) translateX(-50%)";
        disableEverything();
        noteButton.disabled = false;
    }
    else
    {
        noteButton.style.backgroundColor = "black";
        noteDialog.style.transform = "translateY(100vh) translateX(-50%)";
        enableEverything();
    }

}

function code()
{
    var codeDialog = document.getElementById("codeDialog");
    var codeButton = document.getElementById("code");
    if(codeButton.style.backgroundColor === "black")
    {
        codeButton.style.backgroundColor = "#0AF";
        codeDialog.style.transform = "translateY(-50%) translateX(-50%)";
        disableEverything();
        codeButton.disabled = false;
    }
    else
    {
        codeButton.style.backgroundColor = "black";
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
    element = element.parentElement.parentElement;
    if(element.id === "codeDialog")
    {
        document.getElementById("code").style.backgroundColor = "black";
        codeDialog.style.transform = "translateY(100vh) translateX(-50%)";
        enableEverything();
    }
    if(element.id === "noteDialog")
    {
        document.getElementById("note").style.backgroundColor = "black";
        noteDialog.style.transform = "translateY(100vh) translateX(-50%)";
        enableEverything();
    }
}

//editor functions

var content = document.getElementById("content")
var textType = document.getElementById("textType")
/*list of format commands if you want to add command you may add a new button and add command in this list
of course you must modify css*/
var listCommand = ["bold","italic","underline"]

//list of balises
var listBalise = ["I","U","B","SPAN"]


textFormat = (format) =>{
    if (format != undefined && format != "" && format != null)
    {
        if (listCommand.indexOf(format) > -1)
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
    }
    else
    {
        console.warn("aucune commande")
    }
    buttonUpdate()
}

getParent = () =>{
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
getTextSelection = () =>{
    textSelection = window.getSelection()
    text = textSelection.getRangeAt(0).toString()
    return text
}
buttonUpdate = () =>{
    //console.log("update")
    //update the format button's background
    for (var i = 0; i < listCommand.length; i++) {
        var buff = listCommand[i]
        if (document.queryCommandState(buff))
            document.getElementById(buff).style.backgroundColor = "#0AF"
        else
            document.getElementById(buff).style.backgroundColor = "black"
    }
    //update the select
    parent = getParent()
    //get the parent's type ignoring the balises in listBalise
    while (listBalise.indexOf(parent.nodeName)>-1)
        parent = parent.parentNode
    //console.log(parent)
    console.log(parent.nodeName)
    if (parent.nodeName == "BODY")
    {
        /*console.log("undo")*/
        document.execCommand("undo")
    }
    else if (parent.nodeName != "ARTICLE")
        textType.value = parent.nodeName.toLocaleLowerCase()
    else
        textType.value = "div"
    
}
content.onclick = buttonUpdate
content.onkeyup = buttonUpdate

textType.onchange = () =>{
    //get the command
    var buf = textType.selectedOptions[0].value

    //execute the command
    document.execCommand("formatBlock",false,buf)

    //set focus on editor
    content.focus()
}

//list of forbiden parent
var forbiden = ["ARTICLE","H3","H5"]
validate = (obj) =>{

    //if the parent isn't a other tips
    if (parentBuff.nodeName != "P")
    {
        //if the parent isn't in forbiden list
        if (forbiden.indexOf(parentBuff.nodeName) == -1)
        {
            //copy the tips and remove atribute id and onclick
            var copy = obj.cloneNode(true);
            copy.removeAttribute("onclick")
            copy.removeAttribute("id")

            console.log(parentBuff.textContent)
            if (parentBuff.textContent.length > 1)
            {
                copy.children[1].textContent = parentBuff.textContent
            }


            //create div and add it
            var div = document.createElement("div")
            div.innerHTML = "&nbsp;"
            parentBuff.insertAdjacentElement("afterend",div)

            //add copyed typs before div
            parentBuff.insertAdjacentElement("afterend",copy)

            parentBuff.innerHTML = "&nbsp;"
            //hide the tips' tab
            var tab = {parentElement:{parentElement:{id:"noteDialog"}}}
            hide(tab)
        }
        else if (parentBuff.nodeName == "ARTICLE")
        {
            alert("Hey tapez du texte avant d'insérer un tips dessuite !")
        }
        else
        {
            alert("ous ne pensez tout de même pas quue l'on peut metre un tips dans un titre, non mais!")
        }
        //content.appendChild(copy)
    }
    else if (obj.className == "reset")
    {
        var div = document.createElement("div")
        div.textContent = parentBuff.textContent
        parentBuff.parentNode.insertAdjacentElement("afterend",div)
        parentBuff.parentNode.remove()

        var tab = {parentElement:{parentElement:{id:"noteDialog"}}}
        hide(tab)
    }
    else
        alert("Vous ne pouvez pas mettre un tips a l'interieur d'un autre")
}
