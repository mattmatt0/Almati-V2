//save the parent into this before click on button
var parentBuff = 0

//save the selected text into this before click on button
var textBuff = ""
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
    parentBuff = getParent()
    textBuff = getTextSelection()
    var noteDialog = document.getElementById("noteDialog");
    var noteButton = document.getElementById("note");
    if(noteButton.className === "default")
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


textFormat = (format) =>{
    var parent = getParent().nodeName
    if (format != undefined && format != "" && format != null)
    {
        if (parent != "H3" && parent !="H5")
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
        }
        else
            console.warn("titres non modifiables !")
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
            document.getElementById(buff).className = "active"
        else
            document.getElementById(buff).className = "default"
    }
    //update the select
    parent = getParent()
    //get the parent's type ignoring the balises in listBalise
    while (~ listBalise.indexOf(parent.nodeName))
        parent = parent.parentNode
    //console.log(parent)
    console.log(parent.nodeName)
    if (parent.nodeName == "P")
        textType.value = "tips"
    else if ((parent.nodeName == "ARTICLE" || parent.nodeName == "BODY") && getTextSelection() == "")
    {
        document.execCommand("insertHTML",false,"<div>&nbsp;</div>")
        textType.value = "div"
    }
    else
        textType.value = parent.nodeName.toLocaleLowerCase()
}
content.onclick = buttonUpdate
content.onkeyup = buttonUpdate

textType.onchange = () =>{
    //get the command
    var buf = textType.selectedOptions[0].value
    var parent = getParent().nodeName

    if (buf == "tips")
        note()
    else if (parent != "P")
    {
        //execute the command
        document.execCommand("formatBlock",false,buf)
    }
    if (parent == "P")
    {
        textType.value = "tips"
        alert("Vous ne pouvez pas metre de titres dans un tips")
    }
    //set focus on editor
    content.focus()
}


//list of forbiden parent
var forbiden = ["ARTICLE","H3","H5","BUTTON","NAV","SELECT","BODY","OPTION"]

var tipsType = ["warning tips","error tips","good tips","info tips"]
validate = (obj) =>{
    var name = obj.className
    console.log(name)

    //if the parent isn't a other tips
    if (parentBuff.nodeName != "P")
    {
        //if the parent isn't in forbiden list
        if (forbiden.indexOf(parentBuff.nodeName) == -1)
        {
            if (name != "reset")
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
            }
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
            alert("vous ne pensez tout de même pas quue l'on peut metre un tips dans un titre, non mais!")
        }
        //content.appendChild(copy)
    }
    else if (name == "reset")
    {
        var div = document.createElement("div")
        div.textContent = parentBuff.textContent
        parentBuff.parentNode.insertAdjacentElement("afterend",div)
        parentBuff.parentNode.remove()

        var tab = {parentElement:{parentElement:{id:"noteDialog"}}}
        hide(tab)
    }
    else if (~ tipsType.indexOf(name))
    {
        var copy = obj.cloneNode(true);
        copy.removeAttribute("onclick")
        copy.removeAttribute("id")

        copy.children[1].textContent = parentBuff.textContent

        parentBuff = parentBuff.parentNode

        parentBuff.insertAdjacentElement("afterend",copy)
        parentBuff.remove()

        var tab = {parentElement:{parentElement:{id:"noteDialog"}}}
        hide(tab)
    }
    else
    {
        console.warn("Can't place tips in forbiden place")
        var tab = {parentElement:{parentElement:{id:"noteDialog"}}}
        hide(tab)
    }
}
